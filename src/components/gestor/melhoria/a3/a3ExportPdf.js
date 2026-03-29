import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Captura o nó #a3-pdf-template e gera PDF landscape A3.
 * @param {string} fileName — sem extensão, ex. Plano_A3_abc123
 */
export async function exportA3ToPdf(fileName) {
  const el = document.getElementById("a3-pdf-template");
  if (!el) {
    throw new Error("Template PDF não encontrado.");
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#eef2f7",
    width: el.offsetWidth,
    height: el.offsetHeight,
    windowWidth: el.offsetWidth,
    windowHeight: el.offsetHeight,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const imgRatio = canvas.width / canvas.height;
  const pageRatio = pageW / pageH;

  let drawW = pageW;
  let drawH = pageW / imgRatio;
  if (drawH > pageH) {
    drawH = pageH;
    drawW = pageH * imgRatio;
  }

  const x = (pageW - drawW) / 2;
  const y = (pageH - drawH) / 2;

  pdf.addImage(imgData, "PNG", x, y, drawW, drawH);
  pdf.save(`${fileName}.pdf`);
}
