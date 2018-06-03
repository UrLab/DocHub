import rules
import catalog.rules


@rules.predicate
def is_document_author(user, document):
    return document.user == user


@rules.predicate
def is_moderator_of_document_course(user, document):
    return catalog.rules.is_moderator_of_course(user, document.course)


can_change_document = is_document_author | is_moderator_of_document_course

rules.add_perm('documents.upload', rules.always_allow)
rules.add_perm('documents.vote', rules.always_allow)

rules.add_perm('documents.reupload', can_change_document)
rules.add_perm('documents.edit', can_change_document)
rules.add_perm('documents.delete', can_change_document)
