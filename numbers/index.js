import divide from '@microverse-network/webworker-loader!./divide'

const range = length => {
  return Array(length)
    .fill(1)
    .map((curr, i) => i + 1)
}

const createRows = numbers => {
  const rows = numbers.map(
    number => `
    <tr>
      <td id="number-${number}">${number}</td>
      <td id="result-${number}">0</td>
      <td id="time-${number}">0ms</td>
    </tr>
    `,
  )

  return rows.join('')
}

const main = async () => {
  const numbers = range(8)
  const $container = document.getElementById('numbers-container')
  const $runner = document.getElementById('runner')

  $runner.addEventListener('click', async () => {
    numbers.forEach(async number => {
      document.getElementById(`result-${number}`).innerHTML = '…'
      document.getElementById(`time-${number}`).innerHTML = '…ms'

      const start = Date.now()
      const result = await divide(number, 2)
      const end = Date.now()

      document.getElementById(`result-${number}`).innerHTML = result
      document.getElementById(`time-${number}`).innerHTML = `${end - start}ms`
    })
  })

  $container.innerHTML = createRows(numbers)
}

main()
