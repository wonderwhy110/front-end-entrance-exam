document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.querySelector(".btn-download");

  downloadBtn.addEventListener("click", async function () {
    const isDesktop = window.innerWidth > 1024;
    try {
      downloadBtn.disabled = true;
      const element = document.getElementById("app");
      const originalPadding = element.style.paddingBottom;
      element.style.paddingBottom = "20px";
      const canvas = await html2canvas(element, {
        scale: isDesktop ? 4 : 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        width: element.scrollWidth * (isDesktop ? 2 : 1),
        height: element.scrollHeight * (isDesktop ? 2 : 1),
        windowWidth: element.scrollWidth * (isDesktop ? 2 : 1),
        windowHeight: element.scrollHeight * (isDesktop ? 2 : 1) + 200,
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
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);

      const imgWidth = isDesktop ? pageWidth * 1 : pageWidth - 10;
      const xPosition = isDesktop ? 0 : 5;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 5;

      // Первая страница
      pdf.addImage(imgData, "PNG", xPosition, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        position = position - pageHeight; // Правильное смещение
        pdf.addImage(imgData, "PNG", xPosition, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

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