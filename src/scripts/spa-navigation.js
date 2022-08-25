import {
  getNavigationType,
  getPathId,
  isBackNavigation,
  shouldNotIntercept,
  updateTheDOMSomehow,
  useTvFragment,
} from './utils'

navigation.addEventListener('navigate', (navigateEvent) => {
  if (shouldNotIntercept(navigateEvent)) return

  const toUrl = new URL(navigateEvent.destination.url)
  const toPath = toUrl.pathname
  const fromPath = location.pathname
  const navigationType = getNavigationType(fromPath, toPath)

  if (location.origin !== toUrl.origin) return

  switch (navigationType) {
    case 'home-to-movie':
    case 'tv-to-show':
      handleHomeToMovieTransition(navigateEvent, getPathId(toPath))
      break
    case 'movie-to-home':
    case 'show-to-tv':
      handleMovieToHomeTransition(navigateEvent, getPathId(fromPath))
      break
    case 'movie-to-person':
      handleMovieToPersonTransition(
        navigateEvent,
        getPathId(fromPath),
        getPathId(toPath)
      )
      break
    case 'person-to-movie':
    case 'person-to-show':
      handlePersonToMovieTransition(
        navigateEvent,
        getPathId(fromPath),
        getPathId(toPath)
      )
      break
    default:
      return
  }
})

function handleHomeToMovieTransition(navigateEvent, movieId) {
  const handler = async () => {
    const fragmentUrl = useTvFragment(navigateEvent)
      ? '/fragments/TvDetails'
      : '/fragments/MovieDetails'
    const response = await fetch(`${fragmentUrl}/${movieId}`)
    const data = await response.text()

    if (!document.createDocumentTransition) {
      updateTheDOMSomehow(data)
      return
    }

    const transition = document.createDocumentTransition()
    const thumbnail = document.getElementById(`movie-poster-${movieId}`)
    if (thumbnail) {
      thumbnail.style.pageTransitionTag = 'movie-poster'
    }

    transition.start(() => {
      if (thumbnail) {
        thumbnail.style.pageTransitionTag = ''
      }
      document.getElementById('container').scrollTop = 0
      updateTheDOMSomehow(data)
    })
  }

  navigateEvent.transitionWhile(handler())
}

function handleMovieToHomeTransition(navigateEvent, movieId) {
  const handler = async () => {
    const fragmentUrl = useTvFragment(navigateEvent)
      ? '/fragments/TvList'
      : '/fragments/MovieList'
    const response = await fetch(fragmentUrl)
    const data = await response.text()

    if (!document.createDocumentTransition) {
      updateTheDOMSomehow(data)
      return
    }

    const transition = document.createDocumentTransition()
    const tempHomePage = document.createElement('div')
    const moviePoster = document.getElementById(`movie-poster`)
    let thumbnail

    // If the movie poster is not in the home page, removes the transition style so that
    // the poster doesn't stay on the page while transitioning
    tempHomePage.innerHTML = data
    if (!tempHomePage.querySelector(`#movie-poster-${movieId}`)) {
      moviePoster?.classList.remove('movie-poster')
    }

    transition
      .start(() => {
        updateTheDOMSomehow(data)

        thumbnail = document.getElementById(`movie-poster-${movieId}`)
        if (thumbnail) {
          thumbnail.scrollIntoViewIfNeeded()
          thumbnail.style.pageTransitionTag = 'movie-poster'
        }
      })
      .then(() => {
        if (thumbnail) {
          thumbnail.style.pageTransitionTag = ''
        }
      })
  }

  navigateEvent.transitionWhile(handler())
}

function handleMovieToPersonTransition(navigateEvent, movieId, personId) {
  const isBack = isBackNavigation(navigateEvent)
  const handler = async () => {
    const response = await fetch('/fragments/PersonDetails/' + personId)
    const data = await response.text()

    if (!document.createDocumentTransition) {
      updateTheDOMSomehow(data)
      return
    }

    const transition = document.createDocumentTransition()
    let personThumbnail
    let moviePoster
    let movieThumbnail

    if (!isBack) {
      // We're transitioning the person photo; we need to remove the transition of the poster
      // so that it doesn't stay on the page while transitioning
      moviePoster = document.getElementById(`movie-poster`)
      if (moviePoster) {
        moviePoster.classList.remove('movie-poster')
      }

      personThumbnail = document.getElementById(`person-photo-${personId}`)
      if (personThumbnail) {
        personThumbnail.style.pageTransitionTag = 'person-photo'
      }
    }

    transition
      .start(() => {
        updateTheDOMSomehow(data)

        if (personThumbnail) {
          personThumbnail.style.pageTransitionTag = ''
        }

        if (isBack) {
          // If we're coming back to the person page, we're transitioning
          // into the movie poster thumbnail, so we need to add the tag to it
          movieThumbnail = document.getElementById(`movie-poster-${movieId}`)
          if (movieThumbnail) {
            movieThumbnail.scrollIntoViewIfNeeded()
            movieThumbnail.style.pageTransitionTag = 'movie-poster'
          }
        }

        document.getElementById('container').scrollTop = 0
      })
      .then(() => {
        if (movieThumbnail) {
          movieThumbnail.style.pageTransitionTag = ''
        }
      })
  }

  navigateEvent.transitionWhile(handler())
}

function handlePersonToMovieTransition(navigateEvent, personId, movieId) {
  const isBack = isBackNavigation(navigateEvent)
  const handler = async () => {
    const fragmentUrl = useTvFragment(navigateEvent)
      ? '/fragments/TvDetails'
      : '/fragments/MovieDetails'
    const response = await fetch(`${fragmentUrl}/${movieId}`)
    const data = await response.text()

    if (!document.createDocumentTransition) {
      updateTheDOMSomehow(data)
      return
    }

    const transition = document.createDocumentTransition()
    let thumbnail
    let moviePoster
    let movieThumbnail

    if (!isBack) {
      movieThumbnail = document.getElementById(`movie-poster-${movieId}`)
      if (movieThumbnail) {
        movieThumbnail.style.pageTransitionTag = 'movie-poster'
      }
    }

    transition
      .start(() => {
        updateTheDOMSomehow(data)

        if (isBack) {
          moviePoster = document.getElementById(`movie-poster`)
          if (moviePoster) {
            moviePoster.classList.remove('movie-poster')
          }

          if (personId) {
            thumbnail = document.getElementById(`person-photo-${personId}`)
            if (thumbnail) {
              thumbnail.scrollIntoViewIfNeeded()
              thumbnail.style.pageTransitionTag = 'person-photo'
            }
          }
        } else {
          document.getElementById('container').scrollTop = 0

          if (movieThumbnail) {
            movieThumbnail.style.pageTransitionTag = ''
          }
        }
      })
      .then(() => {
        if (thumbnail) {
          thumbnail.style.pageTransitionTag = ''
        }

        if (moviePoster) {
          moviePoster.classList.add('movie-poster')
        }
      })
  }

  navigateEvent.transitionWhile(handler())
}
