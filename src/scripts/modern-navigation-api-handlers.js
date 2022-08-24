/**
 * This file is currently NOT being used by the app.
 *
 * It contains the "modern" version of the navigation handlers using the updated
 * Navigation API (e.g. navigateEvent.intercept() instead of navigateEvent.transitionWhile()).
 *
 * The updated Navigation API is only available in Chrome 105+, which at the time of this demo,
 * is still in beta. The main code uses the deprecated API so that the demo works with Chrome 104.
 * Once 105 reaches GA, the navigation handlers in spa-navigation.js will be replaced with the ones
 * in this file.
 */

function handleHomeToMovieTransition(navigateEvent, movieId) {
  navigateEvent.intercept({
    async handler() {
      const response = await fetch('/fragments/MovieDetails/' + movieId)
      const data = await response.text()
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
    },
  })
}

function handleMovieToHomeTransition(navigateEvent, movieId) {
  navigateEvent.intercept({
    scroll: 'manual',
    async handler() {
      const response = await fetch('/fragments/MovieList')
      const data = await response.text()
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
    },
  })
}

function handleMovieToPersonTransition(navigateEvent, movieId, personId) {
  const isBack = isBackNavigation(navigateEvent)

  navigateEvent.intercept({
    async handler() {
      const transition = document.createDocumentTransition()
      const response = await fetch('/fragments/PersonDetails/' + personId)
      const data = await response.text()
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
    },
  })
}

function handlePersonToMovieTransition(navigateEvent, personId, movieId) {
  const isBack = isBackNavigation(navigateEvent)

  navigateEvent.intercept({
    scroll: 'manual',
    async handler() {
      const transition = document.createDocumentTransition()
      const response = await fetch('/fragments/MovieDetails/' + movieId)
      const data = await response.text()
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
    },
  })
}
