import Aioli from "https://cdn.jsdelivr.net/npm/@biowasm/aioli@latest/dist/aioli.mjs";

(async () => {
  const CLI = await new Aioli("seqtk/1.4");

  const inputPanel = document.getElementById("input-panel");
  const rawOutput = document.getElementById("raw-output");
  const processedOutput = document.getElementById("processed-output");

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) =>
    inputPanel.addEventListener(eventName, preventDefaults, false),
  );

  inputPanel.addEventListener("drop", handleDrop, false);

  async function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    if (!file) return;

    const [mounted] = await CLI.mount(file);
    const text = await CLI.cat(mounted);

    rawOutput.textContent = text;

    const { stdout } = await CLI.exec(`seqtk seq ${mounted}`);
    processedOutput.textContent = stdout;
  }
})();
