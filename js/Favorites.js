import { GithubUser } from './GithubUser.js'

class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.dataLoad()
  }

  async githubSearch(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error('Usuário já cadastrado.')
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.updateView()
      this.dataSave()
    } catch (error) {
      alert(error.message)
    }
  }

  dataLoad() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  dataSave() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  userDelete(user) {
    const filteredEntries = this.entries.filter(
      entry => entry.login !== user.login
    )

    this.entries = filteredEntries
    this.updateView()
    this.dataSave()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.updateView()
    this.searchButton()
  }

  updateView() {
    this.removeTr()
    this.noFavorites()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Deseja remove esse usuário?')

        if (isOk) {
          this.userDelete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  searchButton() {
    const searchButton = this.root.querySelector('.search button')

    searchButton.onclick = () => {
      const { value } = this.root.querySelector('#input-search')

      this.githubSearch(value)
    }
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td>
        <div class="user">
          <img
            src=""
            alt=""
          />
          <a href="" target="_blank">
            <p></p>
            <span></span>
          </a>
        </div>
      </td>
      <td class="repositories"></td>
      <td class="followers"></td>
      <td>
        <button class="remove">Remover</button>
      </td>
    `

    return tr
  }

  removeTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }

  noFavorites() {
    const noFavorites = this.root.querySelector('.noFavoritesSet')

    if (this.entries.length === 0) {
      noFavorites.classList.remove('hide')
    } else {
      noFavorites.classList.add('hide')
    }
  }
}
