<template>
  <div class="models-crud-container bg-0A1128 text-FEFCFB min-vh-100 d-flex flex-column justify-content-center align-items-center">
    <div class="card w-100 p-4 shadow-lg bg-001F54" style="max-width: 800px; border-radius: 16px">
      <h1 class="text-center text-1282A2 mb-4">Gestion des Modèles</h1>

      <!-- Select Brand -->
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

      <!-- Form for Adding/Editing Models -->
      <form @submit.prevent="handleSubmit" class="mb-4">
        <div class="mb-3">
          <label for="model-name" class="form-label fw-bold text-FEFCFB">Nom du modèle :</label>
          <input
            v-model="modelForm.name"
            type="text"
            id="model-name"
            class="form-control border-0 bg-034078 text-FEFCFB shadow-sm"
            style="height: 50px; border-radius: 12px"
            placeholder="Entrez le nom du modèle"
            required
          />
        </div>
        <div class="d-flex justify-content-end">
          <button 
            :disabled="!modelForm.name || !selectedBrand" 
            class="btn fw-bold text-FEFCFB shadow-sm"
            style="background-color: #1282a2; border-radius: 12px; padding: 12px 24px;">
            {{ isEdit ? 'Mettre à jour' : 'Ajouter' }}
          </button>
        </div>
      </form>

      <!-- List of Models -->
      <table class="table table-hover bg-034078 text-FEFCFB">
        <thead class="text-FEFCFB">
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(model, i) in models" :key="model.id">
            <td>{{ i+1 }}</td>
            <td>{{ model.name }}</td>
            <td>
              <button
                class="btn btn-sm btn-primary me-2"
                @click="editModel(model)"
              >
                Modifier
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="deleteModel(model.id)"
              >
                Supprimer
              </button>
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
      selectedBrand: "", // ID of the selected brand
      modelForm: {
        id: null,
        name: "", // Name of the model to add/edit
      },
      isEdit: false, // To track if we are editing or adding
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
      }
    },

    // Fetch models for the selected brand
    async fetchModels() {
      if (!this.selectedBrand) {
        this.models = [];
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/api/models/brands/${this.selectedBrand}`
        );
        this.models = response.data;
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    },

    // Add a new model
    async addModel() {
      if (!this.selectedBrand) {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Veuillez sélectionner une marque avant d'ajouter un modèle.",
        });
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:3000/api/models`,
          {
            name: this.modelForm.name,
            brandId: this.selectedBrand,
          }
        );
        this.models.push(response.data);
        this.resetForm();
        Swal.fire("Succès", "Modèle ajouté avec succès!", "success");
      } catch (error) {
        console.error("Error adding model:", error);
        Swal.fire("Erreur", "Une erreur est survenue lors de l'ajout du modèle.", "error");
      }
    },

    // Update an existing model
    async updateModel() {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/models/${this.modelForm.id}`,
          {
            name: this.modelForm.name,
          }
        );
        const index = this.models.findIndex((model) => model.id === this.modelForm.id);
        this.models[index].name = this.modelForm.name;
        this.resetForm();
        Swal.fire("Succès", "Modèle mis à jour avec succès!", "success");
      } catch (error) {
        console.error("Error updating model:", error);
        Swal.fire("Erreur", "Une erreur est survenue lors de la mise à jour.", "error");
      }
    },

    // Handle form submit (either add or update model)
    async handleSubmit() {
      this.isEdit ? await this.updateModel() : await this.addModel();
    },

    // Edit a model (fill the form)
    editModel(model) {
      this.modelForm = { ...model };
      this.isEdit = true;
    },

    // Reset the form
    resetForm() {
      this.modelForm = { id: null, name: "" };
      this.isEdit = false;
    },

    // Delete a model
    async deleteModel(id) {
      try {
        await axios.delete(`http://localhost:3000/api/models/${id}`);
        this.models = this.models.filter((model) => model.id !== id);
        Swal.fire("Succès", "Modèle supprimé avec succès!", "success");
      } catch (error) {
        console.error("Error deleting model:", error);
        Swal.fire("Erreur", "Une erreur est survenue lors de la suppression.", "error");
      }
    },
  },
};
</script>

<style scoped>
  /* Style similar to your other components */
  .models-crud-container {
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
    max-width: 800px;
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
  
  .table {
    background-color: #034078;
    color: #fefcfb;
  }
  
  button {
    padding: 8px 16px;
    font-weight: bold;
    border-radius: 8px;
    margin: 0 4px;
  }
  
  button.btn-primary {
    background-color: #1282a2;
    color: #fefcfb;
  }
  
  button.btn-danger {
    background-color: #d33;
    color: #fefcfb;
  }
  </style>
  