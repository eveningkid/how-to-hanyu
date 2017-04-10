import React from 'react'
import classNames from 'classnames'
import traditional from '../scrap/traditional'
import simplified from '../scrap/simplified'
import './App.css'

const types = {
  SIMPLIFIED: 'simplified',
  TRADITIONAL: 'traditional',
}

const currentCharacterInitialState = {
  id: '',
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      currentCharacter: currentCharacterInitialState,
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
      currentCharacter: currentCharacterInitialState,
      search: e.target.value,
    }, () => {
      this.handleClick()
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.handleClick()
  }

  handleCharacterClick(currentCharacter, e) {
    e.preventDefault()

    // Force browser to rerender the current
    // character image
    this.setState({currentCharacter: {id: 'a', symbol: '', href: ''}}, () => {
      this.handleMouseOver(currentCharacter, () => {
        this.handleClick()
      })
    })
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

  handleMouseOver(currentCharacter, cb=null, e) {
    this.setState({currentCharacter}, cb && cb(e))
  }

  renderResult(result, key) {
    if (result.found) {
      return (
        <a
          key={key}
          onClick={this.handleCharacterClick.bind(this, result.completeCharacter)}
          onMouseOver={this.handleMouseOver.bind(this, result.completeCharacter, null)}
          className={classNames(
            'link',
            {'selected': result.completeCharacter.id === this.state.currentCharacter.id}
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
    const {
      currentCharacter,
      results,
      search,
      type,
    } = this.state

    return (
      <div className="App">
        <form
          id="search"
          onSubmit={this.handleSubmit.bind(this)}
        >
          <input
            type="search"
            value={search}
            onChange={this.handleChange.bind(this)}
            placeholder="Type here..."
          />
        </form>

        <div id="type-switch">
          {Object.keys(types).map((currentType, i) => (
            <div
              className={classNames(
                'type',
                {'selected': types[currentType] === type}
              )}
              onClick={this.switchType.bind(this, types[currentType])}
              key={i}
            >
              {types[currentType]}
            </div>
          ))}
        </div>

        <div id="results">
          {results.length ? (
            <span>
              <p>
                Hover／click the following characters to get more information.
              </p>

              {results.map(this.renderResult.bind(this))}

              {currentCharacter.id.length > 0 && (
                <div id="current-character">
                  <img
                    alt={`Character ${currentCharacter.character}`}
                    src={`http://www.learnchineseez.com/read-write/images/${currentCharacter.id}.gif`}
                  />

                  <br />

                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={this.getRemoteUrl.call(this) + currentCharacter.href}
                  >
                    <button>
                      More details
                    </button>
                  </a>
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
