import os
from dotenv import load_dotenv

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


def get_insight(text: str) -> str:
    """Generate an insight using the configured AI provider."""
    if AI_PROVIDER == "google":
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
        if not deepseek or not api_key:
            return "DeepSeek not configured."
        # Example DeepSeek usage (pseudo-code, adjust to SDK)
        client = deepseek.Client(api_key=api_key)
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
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": text}]
        )
        return response.choices[0].message["content"]
