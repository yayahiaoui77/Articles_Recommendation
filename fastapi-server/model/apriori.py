#!/usr/bin/env python
# coding: utf-8

# In[10]:


from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules
import pandas as pd
import pickle


# In[2]:


# Load the CSV into a DataFrame
df = pd.read_csv('data/prep_dataset.csv')
df.head()


# In[3]:


df['tags'] = df['tags'].apply(lambda x: x.split(','))
print(df['tags'].head())


# In[4]:


transactions = df['tags'].tolist()

te = TransactionEncoder()
te_ary = te.fit_transform(transactions)
transaction_df = pd.DataFrame(te_ary, columns=te.columns_)
transaction_df


# In[5]:


frequent_itemsets = apriori(transaction_df, min_support=0.001, use_colnames=True)
num_itemsets = frequent_itemsets.shape[0]
rules = association_rules(frequent_itemsets, num_itemsets=num_itemsets, metric="support", min_threshold=0.001)


# In[13]:


def recommend_tags(user_tags, rules, num_recommendations=5):
    # Filter rules where antecedents overlap with user's tags
    relevant_rules = rules[rules['antecedents'].apply(lambda x: len(x.intersection(user_tags)) > 0)]
    
    # Get unique consequents (recommended tags), sorted by confidence
    recommendations = relevant_rules[['consequents', 'confidence']].sort_values(by='confidence', ascending=False)
    recommended_tags = set()
    for _, row in recommendations.iterrows():
        recommended_tags.update(row['consequents'])
        if len(recommended_tags) >= num_recommendations:
            break
    
    # Return top recommendations
    return list(recommended_tags)[:num_recommendations]

# Example: User selects some tags
user_tags = {'Love', 'Programming'}
recommended_tags = recommend_tags(user_tags, rules)
print("\nUser's Chosen Tags:", user_tags)
print("Recommended Tags:", recommended_tags)


# In[11]:


rules.to_pickle("rules.pkl")


# In[7]:


# def recommend_tags(user_tags, df, num_recommendations=10, min_support=0.001):
#     # Step 1: Prepare the dataset
#     # Convert articles' tags to a one-hot encoded dataframe for apriori algorithm
#     transactions = df['tags'].tolist()
#     te = TransactionEncoder()
#     te_ary = te.fit_transform(transactions)
#     transaction_df = pd.DataFrame(te_ary, columns=te.columns_)
    
#     # Step 2: Apply Apriori algorithm to find frequent itemsets
#     frequent_itemsets = apriori(transaction_df, min_support=min_support, use_colnames=True)    
    
#     # Step 3: Generate association rules from frequent itemsets
#     num_itemsets = frequent_itemsets.shape[0]
#     rules = association_rules(frequent_itemsets, num_itemsets=num_itemsets, metric="support", min_threshold=min_support)

#     # Step 4: Filter rules where antecedents overlap with user's tags
#     relevant_rules = rules[rules['antecedents'].apply(lambda x: len(x.intersection(user_tags)) > 0)]
    
#     # Step 5: Get unique consequents (recommended tags), sorted by support
#     recommendations = relevant_rules[['consequents', 'support']].sort_values(by='support', ascending=False)
#     recommended_tags = set()
    
#     for _, row in recommendations.iterrows():
#         recommended_tags.update(row['consequents'])
#         if len(recommended_tags) >= num_recommendations:
#             break
    
#     # Step 6: Include user tags in the recommended tags
#     recommended_tags.update(user_tags)
    
#     # Step 7: Return top recommendations (limited to num_recommendations)
#     return list(recommended_tags)[:num_recommendations]


# In[8]:


# # Example: User selects some tags
# user_tags = {'AI', 'Programming'}
# recommended_tags = recommend_tags(user_tags,df)
# print("\nUser's Chosen Tags:", user_tags)
# print("Recommended Tags:", recommended_tags)


# In[9]:


# user_tags = {'Life', 'Politics','Technology','Blockchain'}
# recommended_tags = recommend_tags(user_tags,df)
# print("\nUser's Chosen Tags:", user_tags)
# print("Recommended Tags:", recommended_tags)

