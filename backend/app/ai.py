import os
from dotenv import load_dotenv
import pandas as pd
import torch

load_dotenv()

AI_PROVIDER = os.getenv("AI_PROVIDER", "openai")

# Import AI SDKs as needed
try:
    import openai
except ImportError:
    openai = None
try:
    import google.generativeai as genai
except ImportError:
    genai = None
try:
    import deepseek
except ImportError:
    deepseek = None
try:
    from transformers import pipeline, AutoTokenizer, AutoModelForQuestionAnswering, AutoModelForSequenceClassification, AutoModelWithLMHead
except ImportError:
    pipeline = None
    AutoTokenizer = None
    AutoModelForQuestionAnswering = None
    AutoModelForSequenceClassification = None
    AutoModelWithLMHead = None


def df_to_table_dict(df: pd.DataFrame) -> dict:
    """
    Convert a pandas DataFrame to the dictionary format required by Hugging Face table QA/summarization models.
    Example output: {"column1": [..], "column2": [..], ...}
    """
    return df.to_dict(orient="list")


def get_insight(text: str, table=None, task: str = "qa") -> str:
    """
    Generate an insight using the configured AI provider.
    If using Hugging Face transformers and table is a DataFrame, it will be converted automatically.
    """
    if AI_PROVIDER == "hf_transformers":
        if not pipeline:
            return "Transformers not installed."
        # If table is a DataFrame, convert it
        if isinstance(table, pd.DataFrame):
            table = df_to_table_dict(table)
        # Table QA (Tapas, TAPEX)
        if task == "qa" and table is not None:
            qa_pipe = pipeline(
                "table-question-answering",
                model="google/tapas-large-finetuned-wtq"
            )
            result = qa_pipe(table=table, query=text)
            return result["answer"]
        # Table summarization (BART-large-CNN)
        elif task == "summarization" and table is not None:
            # Use facebook/bart-large-cnn for table-to-text summarization
            summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn"
            )
            table_str = str(table)
            result = summarizer(table_str)
            return result[0]["summary_text"]
        else:
            return "Task or table not supported for Hugging Face transformers."
    elif AI_PROVIDER == "google":
        api_key = os.getenv("GOOGLE_API_KEY")
        if not genai or not api_key:
            return "Google AI Studio not configured."
        genai.configure(api_key=api_key)
        # Example for Gemini 1.5 Pro
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(text)
        return response.text
    elif AI_PROVIDER == "deepseek":
        api_key = os.getenv("DEEPSEEK_API_KEY")
        if not api_key:
            return "DeepSeek not configured."
        # Use OpenAI-compatible client for DeepSeek
        from openai import OpenAI
        client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": text}]
        )
        return response.choices[0].message.content
    elif AI_PROVIDER == "azure":
        api_key = os.getenv("AZURE_OPENAI_KEY")
        endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
        if not openai or not api_key or not endpoint or not deployment:
            return "Azure OpenAI not configured."
        openai.api_type = "azure"
        openai.api_key = api_key
        openai.api_base = endpoint
        openai.api_version = "2023-05-15"
        response = openai.ChatCompletion.create(
            engine=deployment,
            messages=[{"role": "user", "content": text}]
        )
        return response.choices[0].message["content"]
    else:
        # Default to OpenAI
        api_key = os.getenv("OPENAI_API_KEY")
        if not openai or not api_key:
            return "OpenAI not configured."
        openai.api_key = api_key
        openai.api_type = "openai"
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": text}]
        )
        return response.choices[0].message.content
