import * as prettier from "prettier";

export const generateHTMLCode = (id: string, headers: string[][]) => {
  const host = process.env.FORMSHET_HOST || "http://localhost:3000";
  const code = `
     <form action="${host}/api/v1/form/${id}/submit" method="POST">
    
     <!-- Replace these inputs with your own. Make sure they have a "name" attribute! -->
        ${headers
          .map((element) =>
            element
              .map(
                (header) =>
                  `<input type="text" name="${header}" placeholder="Enter ${header}" />`
              )
              .join("\n")
          )
          .join("")}

          <!-- Add a submit button to your form -->
     <button type="submit">Submit</button>
     </form>
    `;

  return prettier.format(code, { parser: "html" });
};
