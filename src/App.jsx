import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [fileName, setFileName] = useState("");
  const [updateName, setUpdatedFileName] = useState("");
  const [nestedFiles, showNestedFiles] = useState([]);
  const [dummyState, setDummyState] = useState(false);
  const [displayInput, setDisplayInput] = useState(null);

  const fileObj = [
    {
      index: 1,
      name: "first",
      type: "folder",
      file: [
        {
          index: 2,
          name: "second",
          type: "file",
        },
        {
          index: 3,
          name: "third",
          type: "folder",
          file: [
            {
              index: 4,
              name: "fourth",
              type: "folder",
              file: [
                {
                  index: 7,
                  name: "fifth",
                  type: "file",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      index: 5,
      name: "sixth",
      type: "folder",
      file: [
        {
          index: 6,
          name: "seventh",
          type: "file",
        },
      ],
    },
  ];

  const [files, setFiles] = useState(fileObj);

  useEffect(() => {
    display(files);
  }, [dummyState]);

  function handleClick(e, index, folder) {
    if (e.key == "Enter") {
      let found = false;
      const updatedFiles = folder.map((item) => {
        if (item.index === index) {
          found = true;
          if (item.type === "folder" && item.file) {
            item.file.push({
              index: item.file.length + 1,
              name: fileName,
              type: "file",
            });
          }
        } else if (
          item.type === "folder" &&
          item.file &&
          item.file.length > 0
        ) {
          handleClick(index, item.file);
        }
        return item;
      });
      if (found) {
        setDummyState((prevState) => !prevState);
        setDisplayInput(null);
        return updatedFiles;
      }
      return folder;
    }
  }

  function handleDelete(indexToDelete, folder) {
    const deletedItems = folder
      .map((item) => {
        if (item.index === indexToDelete && item.type === "file") {
          return null;
        } else if (
          item.type === "folder" &&
          item.file &&
          item.file.length > 0
        ) {
          item.file = handleDelete(indexToDelete, item.file);
        }
        return item;
      })
      .filter((item) => item !== null);

    setDummyState((prevState) => !prevState);
    return deletedItems;
  }

  function handleUpdateName(e, indexToUpdate, newName, folder) {
    if (e.key === "Enter") {
      const updatedFiles = folder.map((item) => {
        if (item.index === indexToUpdate && item.type === "file") {
          item.name = newName;
        } else if (
          item.type === "folder" &&
          item.file &&
          item.file.length > 0
        ) {
          item.file = handleUpdateName(e, indexToUpdate, newName, item.file);
        }
        return item;
      });

      setDisplayInput(null);
      setDummyState((prevState) => !prevState);

      return updatedFiles;
    }
  }

  function display(items) {
    return items.map((item, index) =>
      item.type === "folder" ? (
        <div key={item.index} style={{ paddingLeft: "1em" }}>
          <div style={{ display: "flex", marginBottom: "2px", gap: "7px" }}>
            <button
              onClick={() => toggleNestedFile(item.index)}
              style={{ border: "none" }}
            >
              {" "}
              {nestedFiles.includes(item.index) ? `▼` : "▶"}{" "}
            </button>
            <div style={{}}>{item.name}</div>
            <button onClick={() => setDisplayInput(item.index)}>+</button>
            {displayInput === item.index && (
              <input
                type="text"
                placeholder="name"
                onChange={(e) => setFileName(e.target.value)}
                onKeyDown={(e) => handleClick(e, item.index, files)}
              />
            )}
          </div>
          {nestedFiles.includes(item.index) && display(item.file)}
        </div>
      ) : (
        <div
          key={item.index}
          style={{ display: "flex", paddingLeft: "1em", gap: "7px" }}
        >
          <div>{item.name}</div>
          <button onClick={() => handleDelete(item.index, files)}>-</button>
          <button onClick={() => setDisplayInput(item.index)}>update</button>
          {displayInput === item.index && (
            <input
              type="text"
              placeholder="update"
              onChange={(e) => setUpdatedFileName(e.target.value)}
              onKeyDown={(e) =>
                handleUpdateName(e, item.index, updateName, files)
              }
            />
          )}
        </div>
      )
    );
  }

  function toggleNestedFile(index) {
    if (nestedFiles.includes(index)) {
      showNestedFiles(nestedFiles.filter((item) => item !== index));
    } else {
      showNestedFiles([...nestedFiles, index]);
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {display(files)}
      </div>
    </>
  );
}

export default App;
