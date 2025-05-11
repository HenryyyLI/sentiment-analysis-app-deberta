import torch
import warnings
warnings.filterwarnings('ignore') 
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import re
import gc
from lime.lime_text import LimeTextExplainer
import nltk
from nltk.corpus import stopwords

nltk.download("stopwords")
nltk.download('punkt')
english_stopwords = set(stopwords.words("english"))

model_name = "mrm8488/deberta-v3-ft-financial-news-sentiment-analysis" 
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained("saved_model/final_DEBERTA", num_labels=3) #DebertaV2ForSequenceClassification
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

class sentModel():
    def predict_proba(self, text: str):
        inputs = tokenizer(text, truncation = True, max_length=100, padding='max_length',  return_tensors="pt")
        inputs.to(device)
        # Make prediction using the trained model
        model.eval()
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probabilities = torch.nn.functional.softmax(logits, dim=-1).cpu().numpy()

            # predicted_class = np.argmax(logits.cpu(), axis=-1)
            # labels = [0, 1, 2]  # Replace with your actual labels
            # predicted_label = labels[predicted_class.item()]
        del inputs, outputs, logits
        torch.cuda.empty_cache()
        gc.collect()
        
        return probabilities

    def sentence_cleaner(self, text):
        # Delete URLs
        pattern = r'http[s]?://\S+'
        text = re.sub(pattern, '', text)

        # Text cleaning
        text = re.sub(r'[\d]+', '', text)  # Remove numbers
        text = re.sub(r'\b\w{1,2}\b', '', text)  # Remove short words
        text = re.sub(r'\b(lol|omg|wtf)\b', '', text)  # Remove specific terms
        text = re.sub(r'\b(Inc|Ltd|Co|Corp|LLC|PLC|AG|GmbH|SA|NV)\b', '', text)  # Remove company abbreviations
        text = re.sub(r'[\.\!\?,;:\"\'\-\(\)\[\]\{\}\`\$]', '', text)  # Remove punctuation using regex
        # Convert to lowercase
        text = text.lower()
        # Remove stop words
        text = ' '.join(word for word in text.split() if word not in english_stopwords)
        text = re.sub(r'\s+', ' ', text).strip() # Remove extra whitespace

        return text

    def run_score(self, text):
        pos_dict = {}
        neg_dict = {}

        instance_text = self.sentence_cleaner(text)
        explainer = LimeTextExplainer(class_names=['Negative', 'Neutral', 'Positive']) 
        # Predict and explain
        exp = explainer.explain_instance(
            text_instance=instance_text,
            classifier_fn=lambda x: self.predict_proba(x),  # Classifier function
            num_samples=100,
            num_features=10,  # Top features to show
            # labels = (0,1,)
        )

        probabilities = self.predict_proba(instance_text)[0]
        total_score = probabilities[2] - probabilities[0]
        sent_label = ['Negative', 'Neutral', 'Positive'][probabilities.argmax()]
    
        for word, score in exp.as_list():
            if score > 0:
                pos_dict[word] = {'score': score}
            elif score < 0:
                neg_dict[word] = {'score': score}

        return (total_score, sent_label, pos_dict, neg_dict)

