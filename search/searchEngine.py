from documents.models import Document
from users.models import User
from difflib import SequenceMatcher
import datetime

today=datetime.datetime.now()

def value(doc):
    return (20*doc.downloads/((((today-doc.created.replace(tzinfo=None)).days)//365+1)**0.5)+doc.views)
    # TODO use upvotes and downvotes

def filterDocs(docs,terms):
    sm=SequenceMatcher(None,"","")
    for doc in docs:
        match=False
        for i in range(len(doc)-1):
            for j in range(i+1,len(doc)):
                for term in terms:
                    if not match:
                        sm.set_seqs(doc.name[i:j+1],term)
                        if sm.ratio()>0.75:
                            match=True
        if not match:
            docs.remove(doc)

def orderDocs(docs):
    orderedDocs=list(docs)
    orderedDocs.sort(key=value)
    return orderedDocs

def genVowelVariants(searchTerm,i=0):
    terms=[searchTerm]
    while i<len(searchTerm):
        if searchTerm[i] not in {"a","à","e","é","è","ê","i","î","o","ô","u","ù","û"}:
            i+=1
            continue
        c=searchTerm[i]
        if c in {"a","à"}:
            for ch in ["a","à"]:
                terms+=genVowelVariants(searchTerm[:i]+ch+searchTerm[i+1:],i+1)
        elif c in {"e","é","è","ê"}:
            for ch in ["e","é","è","ê"]:
                terms+=genVowelVariants(searchTerm[:i]+ch+searchTerm[i+1:],i+1)
        elif c in {"i","î"}:
            for ch in ["i","î"]:
                terms+=genVowelVariants(searchTerm[:i]+ch+searchTerm[i+1:],i+1)
        elif c in {"o","ô"}:
            for ch in ["o","ô"]:
                terms+=genVowelVariants(searchTerm[:i]+ch+searchTerm[i+1:],i+1)
        elif c in {"u","ù","û"}:
            for ch in ["u","ù","û"]:
                terms+=genVowelVariants(searchTerm[:i]+ch+searchTerm[i+1:],i+1)
        i+=1
    return list(set(terms))

def search(docs,requestUser,searchTerm):
    visibleDocs=docs.exclude(hidden=True)
    following=list(visibleDocs.filter(course__in=requestUser.following()))
    notFollowing=list(visibleDocs.exclude(course__in=requestUser.following()))
    terms=genVowelVariants(searchTerm.lower())

    filterDocs(following,terms)
    filterDocs(notFollowing,terms)

    return [orderDocs(following),orderDocs(notFollowing)]

if __name__=="__main__":
    docs=Document.objects
    
    requestUser=User.objects.get(netid="adrian")

    print(requestUser.following())
    
    searchTerm=input("Search: ")
    
    results=search(docs,requestUser,searchTerm)
    
    print(len(results[0]))
    print(results[0])
    print()
    print([str(doc.course) for doc in results[0]])

    print("\n-----\n")

    print(len(results[1]))
    print(results[1])
    print()
    print([str(doc.course) for doc in results[1]])
