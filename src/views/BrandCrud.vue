<template>
    <div class="crud-container bg-0A1128 text-FEFCFB min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div class="card w-100 p-4 shadow-lg bg-001F54" style="max-width: 800px; border-radius: 16px">
        <h1 class="text-center text-1282A2 mb-4">Gestion des Marques</h1>
  
        <!-- Form for Adding/Updating Brand -->
        <form @submit.prevent="handleSubmit" class="mb-4">
          <div class="mb-3">
            <label for="brand-name" class="form-label fw-bold text-FEFCFB">Nom de la marque :</label>
            <input
              v-model="brandForm.name"
              type="text"
              id="brand-name"
              class="form-control border-0 bg-034078 text-FEFCFB shadow-sm"
              style="height: 50px; border-radius: 12px"
              placeholder="Entrez le nom de la marque"
              required
            />
          </div>
          <div class="d-flex justify-content-end">
            <button
              class="btn fw-bold text-FEFCFB shadow-sm"
              style="background-color: #1282a2; border-radius: 12px; padding: 12px 24px"
            >
              {{ isEdit ? 'Mettre à jour' : 'Ajouter' }}
            </button>
          </div>
        </form>
  
        <!-- List of Brands -->
        <table class="table table-hover bg-034078 text-FEFCFB">
          <thead>
            <tr>
              <th class="text-dark">#</th>
              <th class="text-dark">Nom</th>
              <th class="text-dark" colspan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(brand, i) in brands" :key="brand.id">
              <td>{{ i+1 }}</td>
              <td>{{ brand.name }}</td>
              <td>
                <button
                  class="btn btn-sm btn-primary me-2"
                  @click="editBrand(brand)"
                >
                  Modifier
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteBrand(brand.id)"
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
  let i = 1;
  
  export default {
    data() {
      return {
        brands: [],
        brandForm: {
          id: null,
          name: "",
        },
        isEdit: false,
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
      async handleSubmit() {
        if (this.isEdit) {
          this.updateBrand();
        } else {
          this.addBrand();
        }
      },
      async addBrand() {
        try {
          const response = await axios.post("http://localhost:3000/api/brands", {
            name: this.brandForm.name,
          });
          this.brands.push(response.data);
          this.resetForm();
          Swal.fire("Succès", "Marque ajoutée avec succès!", "success");
        } catch (error) {
          console.error("Error adding brand:", error);
          Swal.fire("Erreur", "Une erreur est survenue lors de l'ajout de la marque.", "error");
        }
      },
      async updateBrand() {
        try {
          await axios.put(`http://localhost:3000/api/brands/${this.brandForm.id}`, {
            name: this.brandForm.name,
          });
          const index = this.brands.findIndex(
            (brand) => brand.id === this.brandForm.id
          );
          if (index !== -1) {
            this.brands[index].name = this.brandForm.name;
          }
          this.resetForm();
          Swal.fire("Succès", "Marque mise à jour avec succès!", "success");
        } catch (error) {
          console.error("Error updating brand:", error);
          Swal.fire("Erreur", "Une erreur est survenue lors de la mise à jour de la marque.", "error");
        }
      },
      async deleteBrand(id) {
        try {
          const confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Cette action est irréversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, supprimer!",
          });
  
          if (confirmation.isConfirmed) {
            await axios.delete(`http://localhost:3000/api/brands/${id}`);
            this.brands = this.brands.filter((brand) => brand.id !== id);
            Swal.fire("Supprimé!", "La marque a été supprimée.", "success");
          }
        } catch (error) {
          console.error("Error deleting brand:", error);
          Swal.fire("Erreur", "Une erreur est survenue lors de la suppression.", "error");
        }
      },
      editBrand(brand) {
        this.brandForm.id = brand.id;
        this.brandForm.name = brand.name;
        this.isEdit = true;
      },
      resetForm() {
        this.brandForm.id = null;
        this.brandForm.name = "";
        this.isEdit = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .crud-container {
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
  
  .table th {
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
  