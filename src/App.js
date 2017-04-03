import React from 'react'
import classNames from 'classnames'
import traditional from '../scrap/traditional'
import simplified from '../scrap/simplified'
import './App.css'

const types = {
  SIMPLIFIED: 'simplified',
  TRADITIONAL: 'traditional',
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      currentCharacter: '',
      search: '',
      type: types.SIMPLIFIED,
      results: [],
    }
  }

  getCharacters() {
    if (this.state.type === types.SIMPLIFIED) {
      return simplified
    }

    return traditional
  }

  getRemoteUrl() {
    return `http://www.learnchineseez.com/read-write/${this.state.type}/`
  }

  switchType(type) {
    this.setState({type}, () => {
      this.handleClick()
    })
  }

  handleChange(e) {
    this.setState({
      currentCharacter: '',
      search: e.target.value,
    }, () => {
      this.handleClick()
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.handleClick()
  }

  handleClick(e) {
    const search = this.state.search.split('')
    const charSet = this.getCharacters()
    const results = []

		for (let character of search) {
			if (character.trim()) {
				const result = charSet.caracteres.indexOf(character)
        const newResult = {
          character,
        }

				if (result !== -1) {
					const completeCharacter = charSet.caracteresComplet[result]
          newResult.found = true
          newResult.completeCharacter = completeCharacter
				} else {
          newResult.found = false
				}

        results.push(newResult)
			}
		}

    this.setState({results})
  }

  handleMouseOver(currentCharacter) {
    this.setState({currentCharacter})
  }

  renderResult(result, key) {
    if (result.found) {
      return (
        <a
          key={key}
          rel="noopener noreferrer"
          href={this.getRemoteUrl.call(this) + result.completeCharacter.href}
          target="_blank"
          onTouchStart={this.handleMouseOver.bind(this, result.completeCharacter.id)}
          onMouseOver={this.handleMouseOver.bind(this, result.completeCharacter.id)}
          className={classNames(
            {'selected': result.completeCharacter.id === this.state.currentCharacter}
          )}
        >
          {result.character}
        </a>
      )
    }

    return (
      <span key={key}>
        {result.character}
      </span>
    )
  }

  render() {
    return (
      <div className="App">
        <form
          id="search"
          onSubmit={this.handleSubmit.bind(this)}
        >
          <input
            type="search"
            value={this.state.search}
            onChange={this.handleChange.bind(this)}
            placeholder="Type here..."
          />
        </form>

        <div id="type-switch">
          <div
            className={classNames(
              'type',
              {'selected': this.state.type === types.SIMPLIFIED}
            )}
            onClick={this.switchType.bind(this, types.SIMPLIFIED)}
          >
            Simplified
          </div>

          <div
            className={classNames(
              'type',
              {'selected': this.state.type === types.TRADITIONAL}
            )}
            onClick={this.switchType.bind(this, types.TRADITIONAL)}
          >
            Traditional
          </div>
        </div>

        <div id="results">
          {this.state.results.length ? (
            <span>
              <p>
                Hover／long-tap or click the following characters to get more information.
              </p>

              {this.state.results.map(this.renderResult.bind(this))}

              {this.state.currentCharacter.length > 0 && (
                <div id="current-character">
                  <img src={`http://www.learnchineseez.com/read-write/images/${this.state.currentCharacter}.gif`} />
                </div>
              )}
            </span>
          ) : (
            <p>
              Start by typing a phrase or characters!
            </p>
          )}
        </div>
      </div>
    )
  }
}

export default App
