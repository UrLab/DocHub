export const isFollowed = (courses, course) => {
  for (var i=0; i<courses.length; ++i) {
    if (course.slug==courses[i].slug) {
      return true
    }
  }
  return false
}
