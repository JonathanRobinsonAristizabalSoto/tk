document.addEventListener("DOMContentLoaded", function () {
  // Mapeo de valores a nombres legibles para tipo de documento
  const nombresTipoDocumento = {
    CC: "Cédula de Ciudadanía",
    TI: "Tarjeta de Identidad",
    CE: "Cédula de Extranjería",
    PS: "Pasaporte",
    DNI: "DNI",
    NIT: "NIT"
  };

  async function cargarCatalogos() {
    try {
      const res = await fetch("/tk/server/controller/UsuariosController.php", {
        method: "POST",
        body: new URLSearchParams({ action: "get_catalogos" }),
      });
      const data = await res.json();

      // Tipos de documento
      const tipoDocSelect = document.getElementById("typeDocument");
      if (tipoDocSelect) {
        tipoDocSelect.innerHTML = "";
        data.tipos_documento.forEach(tipo => {
          const opt = document.createElement("option");
          opt.value = tipo;
          opt.textContent = nombresTipoDocumento[tipo] || tipo;
          tipoDocSelect.appendChild(opt);
        });
      }

      // Roles
      const rolSelect = document.getElementById("user-type");
      if (rolSelect) {
        rolSelect.innerHTML = "";
        data.roles.forEach(rol => {
          const opt = document.createElement("option");
          opt.value = rol.id_rol;
          opt.textContent = rol.nombre;
          rolSelect.appendChild(opt);
        });
      }
    } catch (e) {
      // Si falla, no mostrar nada
    }
  }

  cargarCatalogos();
});