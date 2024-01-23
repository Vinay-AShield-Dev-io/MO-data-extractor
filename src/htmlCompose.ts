



export const htmlcomposer = (headerNames: string[], dataList: string[][]) => {
    return `
    <html>
    <head>
      <title>Your Email Title</title>
    </head>
    <body>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: yellow;">
          ${headerNames.map((item) => {
        return (
            `<th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${item}</th>`
        )
    }
    )}
        </tr>
        </thead>
        <tbody>
          ${dataList.map(item => {
            `<tr>
            ${item.map(data => {
              `<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data}</td>`
            })}
            </tr>
            `
        })}
        </tbody>
      </table>
    </body>
    </html>
    `
}