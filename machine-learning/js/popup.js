import actions from './actions.js'

const getTabs = async () => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({type: actions.GET_ALL_TABS}, (response) => {
      const { payload } = response;
      console.log(response)
      const tabSelector = document.getElementById('tab_selector')
      payload.tabs.forEach((tab) => {
        console.log(tab)
        const option = document.createElement('option')
        const textNode = document.createTextNode(tab.title)
        option.appendChild(textNode)
        option.setAttribute("id", tab.id)
        tabSelector.appendChild(option)
      })
      resolve()
    })
  })
}

const getStatesFromBackground = async () => {
  await Promise.all([
    getTabs()
  ])
}

const main = async () => {
  await getStatesFromBackground()
}

main()
