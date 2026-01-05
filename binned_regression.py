import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.multioutput import MultiOutputClassifier
from sklearn.pipeline import make_pipeline
from sklearn.metrics import classification_report, accuracy_score, f1_score, roc_auc_score
from sklearn.preprocessing import label_binarize
from joblib import parallel_backend


training_set = pd.read_csv("cleaned_amazon_reviews.csv")
review = training_set["cleaned_review"]

# Drop 'anticip' because it's all zeros
emotion_names = ["fear","anger","trust","surprise","sadness","disgust","joy"]
n_bins = 3
bin_labels = ["low", "medium", "high"]

y_cont = training_set[emotion_names].values
non_zero_mask = ~np.all(y_cont == 0, axis=1)
review = review[non_zero_mask]
y_cont = y_cont[non_zero_mask]

print(f"Filtered dataset: {len(review)} rows (kept {100*len(review)/len(training_set):.2f}%)")

def bin_column_safe(col, n_bins=n_bins):
    edges = np.quantile(col, np.linspace(0, 1, n_bins+1))
    binned = pd.cut(col, bins=edges, labels=False, include_lowest=True, duplicates='drop')
    return np.nan_to_num(binned, nan=0).astype(int)

y_binned = np.column_stack([bin_column_safe(y_cont[:, i]) for i in range(y_cont.shape[1])])


X_train, X_test, y_train_b, y_test_b = train_test_split(review, y_binned, test_size=0.15, random_state=42)


tfidf = TfidfVectorizer(ngram_range=(1,2), max_features=15000)
base_clf = LogisticRegression(multi_class='multinomial', max_iter=200, solver='saga', n_jobs=1)
multi_clf = MultiOutputClassifier(base_clf, n_jobs=1)

pipe = make_pipeline(tfidf, multi_clf)

# ----------------------------
# Fit and predict using threads
# ----------------------------
with parallel_backend('threading'):
    pipe.fit(X_train, y_train_b)
    y_pred_b = pipe.predict(X_test)

# Predict probabilities for AUC
prob_list = []
prob_list = []
for est in pipe.named_steps['multioutputclassifier'].estimators_:
    X_test_transformed = pipe.named_steps['tfidfvectorizer'].transform(X_test)
    prob_list.append(est.predict_proba(X_test_transformed))


for i, name in enumerate(emotion_names):
    print(f"=== Emotion: {name} ===")
    print(classification_report(y_test_b[:,i], y_pred_b[:,i], digits=4))
    acc = accuracy_score(y_test_b[:,i], y_pred_b[:,i])
    f1 = f1_score(y_test_b[:,i], y_pred_b[:,i], average='macro')
    print(f"Accuracy: {acc:.4f}, F1-macro: {f1:.4f}\n")

# AUC per emotion
n_classes = n_bins
auc_per_emotion = []
for i in range(y_test_b.shape[1]):
    y_true_oh = label_binarize(y_test_b[:,i], classes=list(range(n_classes)))
    p = prob_list[i]
    try:
        auc = roc_auc_score(y_true_oh, p, average='macro', multi_class='ovr')
    except ValueError:
        auc = np.nan
    auc_per_emotion.append(auc)
    print(f"{emotion_names[i]} AUC (macro, OVR): {auc:.4f}")

print("Mean AUC (across emotions):", np.nanmean(auc_per_emotion))

# Exact match accuracy
all_correct = np.all(y_pred_b == y_test_b, axis=1).mean()
print("Exact-match accuracy (all emotion bins correct):", all_correct)
