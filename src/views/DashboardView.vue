<template>
  <div
    class="dashboard-container bg-0A1128 text-FEFCFB min-vh-100 d-flex flex-column justify-content-center align-items-center">
    <div class="card w-100 p-4 shadow-lg bg-001F54" style="max-width: 600px; border-radius: 16px">
      <h1 class="text-center text-1282A2 mb-4">
        Sélection des Marques et Composants
      </h1>

      <div class="mb-4">
        <label for="brand" class="form-label fw-bold text-FEFCFB">Marques :</label>
        <select v-model="selectedBrand" id="brand" class="form-select border-0 bg-034078 text-FEFCFB shadow-sm"
          style="height: 50px; border-radius: 12px" @change="fetchModels">
          <option value="">Sélectionnez une marque</option>
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">
            {{ brand.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label for="model" class="form-label fw-bold text-FEFCFB">Modèles :</label>
        <select v-model="selectedModel" id="model" class="form-select border-0 bg-034078 text-FEFCFB shadow-sm"
          style="height: 50px; border-radius: 12px" @change="fetchAdasComponents">
          <option value="">Sélectionnez un modèle</option>
          <option v-for="model in models" :key="model.id" :value="model.id">
            {{ model.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label for="adas-component" class="form-label fw-bold text-FEFCFB">Composants ADAS :</label>
        <select v-model="selectedAdasComponent" id="adas-component"
          class="form-select border-0 bg-034078 text-FEFCFB shadow-sm" style="height: 50px; border-radius: 12px">
          <option value="">Sélectionnez un composant ADAS</option>
          <option v-for="adasComponent in adasComponents" :key="adasComponent.id" :value="adasComponent.id">
            {{ adasComponent.name }}
          </option>
        </select>
      </div>

      <div class="">
        <button class="btn fw-bold text-FEFCFB shadow-sm float-end"
          style="background-color: #1282a2; border-radius: 12px; padding: 12px 24px;" @click="showProcedure">
          Afficher la procédure
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      brands: [],
      models: [],
      adasComponents: [],
      selectedBrand: "",
      selectedModel: "",
      selectedAdasComponent: "",
    };
  },
  mounted() {
    this.fetchBrands();
  },
  methods: {
  async fetchBrands() {
    try {
      const response = await axios.get("http://localhost:3000/api/brands");
      this.brands = response.data;
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  },
  async fetchModels() {
    if (!this.selectedBrand) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/models/brands/${this.selectedBrand}`
      );
      this.models = response.data;
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  },
  async fetchAdasComponents() {
    if (!this.selectedModel) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/adas-components/by-model/${this.selectedModel}`
      );
      this.adasComponents = response.data;
    } catch (error) {
      console.error("Error fetching ADAS components:", error);
    }
  },
  async showProcedure() {
      if (this.selectedBrand && this.selectedModel && this.selectedAdasComponent) {
        const pdfUrl = `http://localhost:3000/api/procedure-pdf/${this.selectedBrand}/${this.selectedModel}/${this.selectedAdasComponent}`;

        try {
          const response = await axios.get(pdfUrl, { responseType: 'blob' });
          // Open PDF if the response is successful (it means the file exists)
          const file = new Blob([response.data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL, '_blank');
        } catch (error) {
          // Check if the error response is from the backend (404 and error JSON)
          if (error.response && error.response.status === 404) {
            const errorMessage = error.response.data.message || "Le fichier PDF demandé n'existe pas!";
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: errorMessage,
            });
          } else {
            // Handle other errors
            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: "Une erreur est survenue lors de la récupération du fichier PDF.",
            });
          }
        }
      } else {
        // If fields are not selected
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Veuillez sélectionner une marque, un modèle et un composant ADAS avant de continuer.",
        });
      }
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  background-color: #0a1128;
  color: #fefcfb;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card {
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  border-radius: 16px;
  background-color: #001f54;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 32px;
  color: #1282a2;
  margin-bottom: 1rem;
}

.form-label {
  font-weight: bold;
  color: #fefcfb;
}

.form-select {
  height: 50px;
  border-radius: 12px;
  background-color: #034078;
  color: #fefcfb;
  border: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.form-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px #1282a2;
}

button {
  padding: 12px 24px;
  font-weight: bold;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button:first-child {
  background-color: #1282a2;
  color: #fefcfb;
}

button:last-child {
  background-color: #001f54;
  color: #fefcfb;
}

button:hover {
  opacity: 0.9;
}
</style>
