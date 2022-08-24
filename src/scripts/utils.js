export function getNavigationType(fromPath, toPath) {
  if (fromPath.startsWith('/movies') && toPath === '/') {
    return 'movie-to-home'
  }

  if (fromPath === '/' && toPath.startsWith('/movies')) {
    return 'home-to-movie'
  }

  if (fromPath.startsWith('/movies') && toPath.startsWith('/people')) {
    return 'movie-to-person'
  }

  if (fromPath.startsWith('/people') && toPath.startsWith('/movies')) {
    return 'person-to-movie'
  }

  // Handle TV scenarios. Same as movie, but:
  // 1. Need to make sure that root /tv path doesn't break things (no ID)
  // 2. Need to request the tvlist or tvdetails fragments

  // Handle 'other' transitions if they have a corresponding fragment (for example when navigating between about, movies, and tv)

  return 'other'
}

export function isBackNavigation(navigateEvent) {
  if (
    navigateEvent.navigationType === 'push' ||
    navigateEvent.navigationType === 'replace'
  ) {
    return false
  }
  if (
    navigateEvent.destination.index !== -1 &&
    navigateEvent.destination.index < navigation.currentEntry.index
  ) {
    return true
  }
  return false
}

export function shouldNotIntercept(navigationEvent) {
  return (
    navigationEvent.canIntercept === false ||
    // If this is just a hashChange,
    // just let the browser handle scrolling to the content.
    navigationEvent.hashChange ||
    // If this is a download,
    // let the browser perform the download.
    navigationEvent.downloadRequest ||
    // If this is a form submission,
    // let that go to the server.
    navigationEvent.formData
  )
}

export function getPathId(path) {
  return path.split('/')[2]
}

export function updateTheDOMSomehow(data) {
  document.getElementById('content').innerHTML = data
}
