import rules


@rules.predicate
def is_moderator_of_course(user, course):
    moderated_ids = [x.id for x in user.moderated_courses.only('id')]
    return course.id in moderated_ids
