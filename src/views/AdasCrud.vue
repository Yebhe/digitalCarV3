<template>
  <div class="dashboard-container bg-0A1128 text-FEFCFB min-vh-100 d-flex flex-column justify-content-center align-items-center mb-3">
    <div class="card w-100 p-4 shadow-lg bg-001F54" style="max-width: 800px; border-radius: 16px">
      <h1 class="text-center text-1282A2 mb-4">Gestion des Composants ADAS</h1>

      <!-- Select Brand -->
      <div class="mb-4">
        <label for="brand" class="form-label fw-bold text-FEFCFB">Marques :</label>
        <select v-model="selectedBrand" id="brand" class="form-select border-0 bg-034078 text-FEFCFB shadow-sm" style="height: 50px; border-radius: 12px" @change="fetchModels">
          <option value="">Sélectionnez une marque</option>
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">
            {{ brand.name }}
          </option>
        </select>
      </div>

      <!-- Select Model -->
      <div class="mb-4">
        <label for="model" class="form-label fw-bold text-FEFCFB">Modèles :</label>
        <select v-model="selectedModel" id="model" class="form-select border-0 bg-034078 text-FEFCFB shadow-sm" style="height: 50px; border-radius: 12px" @change="fetchAdasComponents">
          <option value="">Sélectionnez un modèle</option>
          <option v-for="model in models" :key="model.id" :value="model.id">
            {{ model.name }}
          </option>
        </select>
      </div>

      <!-- Form for Adding/Editing ADAS Component -->
      <form @submit.prevent="handleAdasSubmit" class="mb-4">
        <div class="mb-3">
          <label for="adas-name" class="form-label fw-bold text-FEFCFB">Nom du Composant ADAS :</label>
          <input
            v-model="newAdasComponent.name"
            type="text"
            id="adas-name"
            class="form-control border-0 bg-034078 text-FEFCFB shadow-sm"
            style="height: 50px; border-radius: 12px"
            placeholder="Entrez le nom du composant ADAS"
            required
          />
        </div>
        <div class="d-flex justify-content-end">
          <button
            :disabled="!newAdasComponent.name || !selectedBrand || !selectedModel"
            class="btn fw-bold text-FEFCFB shadow-sm"
            style="background-color: #1282a2; border-radius: 12px; padding: 12px 24px;">
            {{ isAdasEdit ? 'Mettre à jour' : 'Ajouter' }}
          </button>
        </div>
      </form>

      <!-- List of ADAS Components -->
      <table class="table table-hover bg-034078 text-FEFCFB">
        <thead class="text-FEFCFB">
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(adasComponent, i) in adasComponents" :key="adasComponent.id">
            <td>{{ i+1 }}</td>
            <td>{{ adasComponent.name }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2" @click="editAdasComponent(adasComponent)">Modifier</button>
              <button class="btn btn-sm btn-danger" @click="deleteAdasComponent(adasComponent.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      brands: [], // List of brands
      models: [], // List of models for the selected brand
      adasComponents: [], // List of ADAS components for the selected model
      selectedBrand: "", // ID of the selected brand
      selectedModel: "", // ID of the selected model
      newAdasComponent: {
        id: null,
        name: "", // Name of the ADAS component to add/edit
      },
      isAdasEdit: false, // To track if we are editing or adding an ADAS component
    };
  },
  mounted() {
    this.fetchBrands();
  },
  methods: {
    // Fetch all brands
    async fetchBrands() {
      try {
        const response = await axios.get("http://localhost:3000/api/brands");
        this.brands = response.data;
      } catch (error) {
        console.error("Error fetching brands:", error);
        Swal.fire("Erreur", "Une erreur est survenue lors du chargement des marques.", "error");
      }
    },

    // Fetch models for the selected brand
    async fetchModels() {
      if (!this.selectedBrand) {
        this.models = [];
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3000/api/models/brands/${this.selectedBrand}`)
        this.models = response.data;
      } catch (error) {
        console.error("Error fetching models:", error);
        Swal.fire("Erreur",
         "Une erreur est survenue lors du chargement des modèles.",
          "error"
        );
      }
    },

    // Fetch ADAS components for the selected model
    async fetchAdasComponents() {
      if (!this.selectedModel) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/adas-components/by-model/${this.selectedModel}`);
        this.adasComponents = response.data;
      } catch (error) {
        console.error("Error fetching ADAS components:", error);
        Swal.fire("Erreur", "Une erreur est survenue lors du chargement des composants ADAS.", "error");
      }
    },

    // Add or update an ADAS component
    async handleAdasSubmit() {
      if (this.isAdasEdit) {
        await this.updateAdasComponent();
      } else {
        await this.addAdasComponent();
      }
    },

    // Add a new ADAS component
    async addAdasComponent() {
      if (!this.selectedBrand || !this.selectedModel) {
        Swal.fire("Erreur", "Veuillez sélectionner une marque et un modèle avant d'ajouter un composant ADAS.", "error");
        return;
      }

      try {
        const response = await axios.post("http://localhost:3000/api/adas-components", {
          name: this.newAdasComponent.name,
          brandId: this.selectedBrand,
          modelId: this.selectedModel,
        });
        this.adasComponents.push(response.data);
        this.resetAdasForm();
        Swal.fire("Succès", "Composant ADAS ajouté avec succès!", "success");
      } catch (error) {
        console.error("Error adding ADAS component:", error);
        Swal.fire("Erreur", "Une erreur est survenue lors de l'ajout du composant ADAS.", "error");
      }
    },

    // Update an existing ADAS component
    async updateAdasComponent() {
      if (!this.selectedModel) {
        Swal.fire("Erreur", "Veuillez sélectionner un modèle avant de mettre à jour.", "error");
        return;
      }

      try {
        const response = await axios.put(`http://localhost:3000/api/adas-components/${this.newAdasComponent.id}`, {
          name: this.newAdasComponent.name,
          modelId: this.selectedModel, // Ajouter le modelId à la mise à jour
        });
        const index = this.adasComponents.findIndex((component) => component.id === this.newAdasComponent.id);
        this.adasComponents[index].name = this.newAdasComponent.name;
        this.adasComponents[index].model_id = this.selectedModel;
        this.resetAdasForm();
        Swal.fire("Succès", "Composant ADAS mis à jour avec succès!", "success");
      } catch (error) {
        console.error("Error updating ADAS component:", error);
        Swal.fire("Erreur", "Une erreur est survenue lors de la mise à jour.", "error");
      }
    },


    // Edit an ADAS component (fill the form)
    editAdasComponent(adasComponent) {
      this.newAdasComponent = { ...adasComponent };
      this.isAdasEdit = true;
    },

    // Reset the form
    resetAdasForm() {
      this.newAdasComponent = { id: null, name: "" };
      this.isAdasEdit = false;
    },

    // Delete an ADAS component
    async deleteAdasComponent(id) {
      try {
        await axios.delete(`http://localhost:3000/api/adas-components/${id}`);
        this.adasComponents = this.adasComponents.filter((component) => component.id !== id);
        Swal.fire("Succès", "Composant ADAS supprimé avec succès!", "success");
      } catch (error) {
        console.error("Error deleting ADAS component:", error);
        Swal.fire("Erreur", "Une erreur est survenue lors de la suppression.", "error");
      }
    },
  },
};
</script>

<style scoped>
/* Global styles */
.dashboard-container {
  background-color: #0a1128;
  color: #fefcfb;
}

.card {
  max-width: 800px;
  border-radius: 16px;
}

.text-1282A2 {
  color: #1282a2;
}

.bg-034078 {
  background-color: #034078;
}

.bg-001F54 {
  background-color: #001f54;
}

.table {
  border-radius: 8px;
}

.table-hover tbody tr:hover {
  background-color: #0e2d4f;
}

.form-label {
  color: #fefcfb;
}

.form-select,
.form-control {
  background-color: #034078;
  color: #fefcfb;
  border-radius: 12px;
  border: none;
}

.form-select:focus,
.form-control:focus {
  background-color: #026493;
  box-shadow: 0 0 5px rgba(18, 130, 162, 0.5);
}

.btn {
  font-weight: bold;
  border-radius: 12px;
  padding: 12px 24px;
}

.btn-primary {
  background-color: #1282a2;
  border: none;
}

.btn-primary:hover {
  background-color: #0c6e8c;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
}

.btn-danger:hover {
  background-color: #b02a37;
}

.d-flex.justify-content-end {
  margin-top: 20px;
}
</style>
