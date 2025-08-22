document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.querySelector(".btn-download");

  downloadBtn.addEventListener("click", async function (e) {
    // Останавливаем всплытие события
    e.stopPropagation();
    e.preventDefault();
    
    if (this.disabled) return;
    
    try {
      downloadBtn.disabled = true;
      const element = document.getElementById("app");
      const originalPadding = element.style.paddingBottom;
      element.style.paddingBottom = "20px";
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        windowHeight: element.scrollHeight + 100,
        onclone: function (clonedDoc) {
          clonedDoc.getElementById("app").style.paddingBottom = "20px";
        },
      });

      element.style.paddingBottom = originalPadding;
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jspdf.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth - 10;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 5, 5, imgWidth, imgHeight);
      pdf.save("моё_резюме.pdf");
      
    } catch (error) {
      console.error("Ошибка при создании PDF:", error);
      alert("Произошла ошибка при создании PDF. Пожалуйста, попробуйте позже.");
    } finally {
      downloadBtn.textContent = "Скачать";
      downloadBtn.classList.remove("generating");
      downloadBtn.disabled = false;
    }
  });
});