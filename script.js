const form = document.querySelector("#form");
const result = document.querySelector("#result");
const handles = document.querySelector("#handles");
const submit = document.querySelector("#submit");
const loading = document.querySelector("#loading");
const isSorted = document.querySelector("#isSorted");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const handlesString = handles.value;
  if (handles == null) {
    return alert("No handle provided");
  }
  submit.classList.add("d-none");
  loading.classList.remove("d-none");
  let data = await trackHandles(handlesString);
  if (data.status !== "OK") {
    submit.classList.remove("d-none");
    loading.classList.add("d-none");
    return alert(data.message);
  }
  createTable(
    isSorted.checked
      ? data.result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      : data.result
  );
  submit.classList.remove("d-none");
  loading.classList.add("d-none");
});

const trackHandles = async (spaceSeparatedHandles) => {
  const handles = spaceSeparatedHandles
    .split(/[, ;\n]+/)
    .filter((item) => item);
  let result;
  try {
    result = await fetch(
      "https://codeforces.com/api/user.info?handles=" + handles.join(";"),
      { method: "GET" }
    );
    result = await result.json();
    if (result.status === "FAILED") {
      return {
        status: "FAILED",
        message: result.comment,
      };
    } else if (result.status === "OK") {
      return {
        status: "OK",
        result: result.result,
      };
    } else {
      return {
        status: "UNKNOWN",
        message: "UNKNOWN",
      };
    }
  } catch (error) {
    return {
      status: "ERROR",
      message: error.message,
    };
  }
};

const createTable = (data) => {
  let table = `<table class="table table-striped rounded my-4">
  <thead class="bg-dark text-white">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Handle</th>
      <th scope="col">First Name</th>
      <th scope="col">Last Name</th>
      <th scope="col">Rating</th>
      <th scope="col">Rank</th>
      <th scope="col">Contribution</th>
      <th scope="col">Max Rating</th>
      <th scope="col">Max Rank</th>
      <th scope="col">City</th>
      <th scope="col">Country</th>
      <th scope="col">Profile</th>
    </tr>
  </thead>
  <tbody>`;
  data.forEach((item, index) => {
    table += `<tr><th scope="row">${index + 1}</th><td>${colorCodedByRating(
      item.handle,
      item.rating || 0,
      true
    )}</td><td>${item.firstName || ""}</td><td>${
      item.lastName || ""
    }</td><td>${colorCodedByRating(
      item.rating || "",
      item.rating || 0
    )}</td><td>${colorCodedByRating(
      item.rank || "",
      item.rating || 0
    )}</td><td>${item.contribution}</td><td>${item.maxRating || ""}</td><td>${
      item.maxRank || ""
    }</td><td>${item.city || ""}</td><td>${
      item.country || ""
    }</td><td><a href="https://codeforces.com/profile/${
      item.handle
    }" target="_blank">${colorCodedByRating(
      item.handle,
      item.rating || 0,
      true
    )}</a></td></tr>`;
  });
  table += "</tbody></table>";
  result.innerHTML = table;
};

const colorCodedByRating = (content, rating, isName) => {
  if (rating >= 3000) {
    return isName
      ? `<span style="color: black;">${
          content[0]
        }</span><span style="color: red;">${content.slice(1)}</span>`
      : `<span style="color: red;">${content}</span>`;
  } else if (rating >= 2600 && rating < 3000) {
    return `<span style="color: red;">${content}</span>`;
  } else if (rating >= 2400 && rating < 2600) {
    return `<span style="color: red;">${content}</span>`;
  } else if (rating >= 2300 && rating < 2400) {
    return `<span style="color: orange;">${content}</span>`;
  } else if (rating >= 2100 && rating < 2300) {
    return `<span style="color: orange;">${content}</span>`;
  } else if (rating >= 1900 && rating < 2100) {
    return `<span style="color: #a0a;">${content}</span>`;
  } else if (rating >= 1600 && rating < 1900) {
    return `<span style="color: blue;">${content}</span>`;
  } else if (rating >= 1400 && rating < 1600) {
    return `<span style="color: #03a89e;">${content}</span>`;
  } else if (rating >= 1200 && rating < 1400) {
    return `<span style="color: green;">${content}</span>`;
  } else if (rating >= 0 && rating < 1200) {
    return `<span style="color: gray;">${content}</span>`;
  } else {
    return content;
  }
};
