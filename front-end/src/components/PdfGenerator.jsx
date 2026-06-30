// src/components/PdfGenerator.jsx
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const toggleScrollForPdf = (enable) => {
  const elements = document.querySelectorAll("[data-pdf-scroll]");

  elements.forEach((el) => {
    if (enable) {
      // guarda overflow atual
      el.dataset.prevOverflow = el.style.overflow || "";
      el.style.overflow = "visible"; // deixa crescer pra caber tudo
    } else {
      // restaura overflow antigo
      if (el.dataset.prevOverflow !== undefined) {
        el.style.overflow = el.dataset.prevOverflow;
        delete el.dataset.prevOverflow;
      } else {
        el.style.removeProperty("overflow");
      }
    }
  });
};

// Substitui inputs e selects por spans para captura correta no PDF
const replaceInputsForPdf = (container) => {
  const replacements = [];

  // Substitui inputs
  container.querySelectorAll("input").forEach((input) => {
    const span = document.createElement("span");
    span.textContent = input.value;
    span.style.cssText = window.getComputedStyle(input).cssText;
    span.style.display = "inline-block";
    span.style.minWidth = input.offsetWidth + "px";
    span.style.padding = "4px 12px";
    span.style.textAlign = "right";
    span.className = input.className;
    
    replacements.push({ original: input, replacement: span, parent: input.parentNode });
    input.parentNode.insertBefore(span, input);
    input.style.display = "none";
  });

  // Substitui selects
  container.querySelectorAll("select").forEach((select) => {
    const selectedOption = select.options[select.selectedIndex];
    const span = document.createElement("span");
    span.textContent = selectedOption ? selectedOption.textContent : "";
    span.style.display = "inline-block";
    span.style.minWidth = select.offsetWidth + "px";
    span.style.padding = "8px 16px";
    span.className = select.className;
    
    replacements.push({ original: select, replacement: span, parent: select.parentNode });
    select.parentNode.insertBefore(span, select);
    select.style.display = "none";
  });

  return replacements;
};

// Restaura inputs e selects originais
const restoreInputsAfterPdf = (replacements) => {
  replacements.forEach(({ original, replacement }) => {
    original.style.display = "";
    if (replacement.parentNode) {
      replacement.parentNode.removeChild(replacement);
    }
  });
};

const PdfGenerator = () => {
  const handleGeneratePDF = async () => {
    const input = document.getElementById("pdf-content");

    if (!input) {
      console.error('Elemento com id "pdf-content" não encontrado.');
      alert('Erro: elemento "pdf-content" não encontrado na página.');
      return;
    }

    let replacements = [];

    try {
      // desliga scroll pra não cortar conteúdo
      toggleScrollForPdf(true);
      
      // substitui inputs e selects por spans
      replacements = replaceInputsForPdf(input);

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const usableWidth = pdfWidth - margin * 2;

      const imgHeight = (canvas.height * usableWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = margin;

      // primeira página
      pdf.addImage(imgData, "PNG", margin, position, usableWidth, imgHeight);
      heightLeft -= pdfHeight;

      // páginas extras, se o conteúdo passar de 1 página
      while (heightLeft > 0) {
        pdf.addPage();
        position = margin;
        pdf.addImage(imgData, "PNG", margin, position, usableWidth, imgHeight);
        heightLeft -= pdfHeight - margin * 2;
      }

      pdf.save("simulacao-final.pdf");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Ocorreu um erro ao gerar o PDF. Veja o console para detalhes.");
    } finally {
      // restaura inputs e selects
      restoreInputsAfterPdf(replacements);
      // volta scroll ao normal
      toggleScrollForPdf(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGeneratePDF}
      className="bg-[#2a3b8f] text-white px-4 py-2 cursor-pointer rounded-md shadow-md hover:bg-[#23316d] transition"
    >
      Gerar PDF
    </button>
  );
};

export default PdfGenerator;
