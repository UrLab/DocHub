from documents.models import Document
from users.models import User
from difflib import SequenceMatcher
import datetime

today=datetime.datetime.now()

def value(doc):
    votes=doc.votes
    val=(20*doc.downloads/((((today-doc.created.replace(tzinfo=None)).days)//365+1)**0.5)+doc.views+1)*(votes["upvotes"]+1)/(votes["downvotes"]+1)
    #print(doc,val)
    return -val

def filterDocs(docs,noMatch,term):
    sm=SequenceMatcher(None,"","")
    d=0
    while d<len(docs):
        doc=docs[d]
        d+=1
        match=False
        for i in range(len(doc.name)-1):
            for j in range(i+1,len(doc.name)):
                if not match:
                    sm.set_seqs(getBaseVowels(doc.name[i:j+1].lower().strip()),term.strip())
                    if sm.ratio()>0.7 or term.strip()=="":
                        match=True
        if not match:
            docs.remove(doc)
            noMatch.append(doc)
            d-=1

def orderDocs(docs):
    orderedDocs=list(docs)
    orderedDocs.sort(key=value)
    return orderedDocs

def getBaseVowels(term):
    res=term
    for ch in ["a","à"]:
        res=res.replace(ch,"a")
    for ch in ["e","é","è","ê"]:
        res=res.replace(ch,"e")
    for ch in ["i","î"]:
        res=res.replace(ch,"i")
    for ch in ["o","ô"]:
        res=res.replace(ch,"o")
    for ch in ["u","ù","û"]:
        res=res.replace(ch,"u")
    return res

def search(docs,requestUser,searchTerm):
    visibleDocs=docs.exclude(hidden=True)
    following=list(visibleDocs.filter(course__in=requestUser.following()))
    notFollowing=list(visibleDocs.exclude(course__in=requestUser.following()))
    term=getBaseVowels(searchTerm.lower())

    fNoMatch=[]
    nfNoMatch=[]

    filterDocs(following,fNoMatch,term)
    filterDocs(notFollowing,nfNoMatch,term)

    return [orderDocs(following),orderDocs(notFollowing),orderDocs(fNoMatch),orderDocs(nfNoMatch)]

if __name__=="__main__":
    docs=Document.objects
    
    requestUser=User.objects.get(netid="adrian")

    print(requestUser.following())
    
    searchTerm=input("Search: ")
    
    results=search(docs,requestUser,searchTerm)
    
    for i,result in enumerate(results):
        print("\n-----\n")
        print(["MATCH FOLLOWING","MATCH NOT FOLLOWING","NO MATCH FOLLOWING","NO MATCH NOT FOLLOWING"][i])

        print(len(result))
        print(result)
        print()
        print([str(doc.course) for doc in result])
