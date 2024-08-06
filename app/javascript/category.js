// ブラウザが読み込まれて、loadイベントが発火。
window.addEventListener("turbo:load", function () {

  const parentCategory = document.getElementById("parent-category")
  const selectWrap = document.getElementById("select-wrap")


  const selectChildElement = (selectForm) => {
    if (document.getElementById(selectForm)) {
      document.getElementById(selectForm).remove()
    }
  }

  // Ajax通信を可能にする。
  const XHR = new XMLHttpRequest()
  const categoryXHR = (id) => {
    XHR.open("GET", `/category/${id}`, true)
    XHR.responseType = "json"
    XHR.send()
  }

  // 子カテゴリーの値をすべて取得する関数。
  const getChildCategoryData = () => {
    const parentValue = parentCategory.value
    categoryXHR(parentValue)

    // コントローラからJson形式でレスポンスの受信が成功したときに、onloadが発火する。
    XHR.onload = () => {
      const items = XHR.response.item
      appendChildSelect(items)
      const childCategory = document.getElementById("child-select")

      // 子カテゴリーのプルダウンの値が変化することによって孫カテゴリーのイベント発火する。
      childCategory.addEventListener("change", () => {
        selectChildElement("grand-child-select-wrap")
        getGrandchildCategoryData(childCategory)
      })
    }
  }

  // 子カテゴリーのプルダウンを表示させる関数
  const appendChildSelect = (items) => {
    const childWrap = document.createElement("div")
    const childSelect = document.createElement("select")

    childWrap.setAttribute("id", "child-select-wrap")
    childSelect.setAttribute("id", "child-select")

    // forEach文でitem（子カテゴリーの値）の選択肢を生成
    items.forEach(item => {
      const childOption = document.createElement("option")
      childOption.innerHTML = item.name
      childOption.setAttribute("value", item.id)
      childSelect.appendChild(childOption)
    })

    childWrap.appendChild(childSelect)
    selectWrap.appendChild(childWrap)
  }

  // 孫カテゴリーの値をすべて取得する関数
  const getGrandchildCategoryData = (grandchildCategory) => {
    const grandchildValue = grandchildCategory.value
    categoryXHR(grandchildValue) 

    // コントローラーからJSON形式でレスポンスの受信が成功したときに、onloadが発火
    XHR.onload = () => {
      const GrandChildItems = XHR.response.item
      appendGrandChildSelect(GrandChildItems)
    }
  }

  // 孫カテゴリーのプルダウンを表示させる関数
  const appendGrandChildSelect = (items) => {
    const childWrap = document.getElementById("child-select-wrap")
    const grandchildWrap = document.createElement("div")
    const grandchildSelect = document.createElement("select")

    grandchildWrap.setAttribute("id", "grand-child-select-wrap")
    grandchildSelect.setAttribute("id", "grand-child-select")

    items.forEach(item => {
      const grandchildOption = document.createElement("option")
      grandchildOption.innerHTML = item.name
      grandchildOption.setAttribute("value", item.id)

      grandchildSelect.appendChild(grandchildOption)
    })

    grandchildWrap.appendChild(grandchildSelect)
    childWrap.appendChild(grandchildWrap)
  }

  // 親カテゴリーを選択した後に発火するイベント
  parentCategory.addEventListener("change", function () {
    selectChildElement("child-select-wrap")
    getChildCategoryData()
  })
})