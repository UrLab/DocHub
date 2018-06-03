import rules
import catalog.rules


@rules.predicate
def is_thread_initiator(user, thread):
    return thread.user == user


@rules.predicate
def is_message_author(user, message):
    return message.user == user


@rules.predicate
def is_moderator_of_thread_course(user, thread):
    return catalog.rules.is_moderator_of_course(user, thread.course)


can_change_thread = is_thread_initiator | is_moderator_of_thread_course
can_change_message = is_message_author | is_moderator_of_thread_course


rules.add_perm('messages.edit', can_change_message)
