document.addEventListener("DOMContentLoaded", function () {
  function isEditable(element) {
    return (
      element.hasAttribute("name") &&
      element.getAttribute("name") === "editable" &&
      !element.classList.contains("no-edit")
    );
  }

  function loadSavedData() {
    document.querySelectorAll('[name="editable"]').forEach((element) => {
      const savedValue = localStorage.getItem(element.id);
      if (savedValue) {
        element.innerHTML = savedValue;
        element.dataset.original = savedValue;
      }
    });
  }

  document.addEventListener("click", function (e) {
    const target = e.target;

    if (isEditable(target)) {
      e.stopPropagation();
      startEditing(target);
    } else if (document.querySelector('[name="editable"].editing')) {
      saveEditing();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Enter" &&
      document.querySelector('[name="editable"].editing')
    ) {
      e.preventDefault();
      saveEditing();
    }
  });

  function startEditing(element) {
    if (document.querySelector('[name="editable"].editing')) {
      saveEditing();
    }
    element.contentEditable = true;
    element.classList.add("editing");
    element.focus();

    if (!element.dataset.original) {
      element.dataset.original = element.innerHTML;
    }
  }

 
  function saveEditing() {
    const editingElement = document.querySelector('[name="editable"].editing');
    if (editingElement) {
      editingElement.contentEditable = false;
      editingElement.classList.remove("editing");
   
      localStorage.setItem(editingElement.id, editingElement.innerHTML);
    }
  }

  
  loadSavedData();

  document.querySelectorAll(".ripple").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      
      const ripple = document.createElement("span");
      ripple.classList.add("ripple-effect");

   
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

     
      btn.appendChild(ripple);

      
      ripple.addEventListener("animationend", () => {
        ripple.remove();
      });
    });
  });
});