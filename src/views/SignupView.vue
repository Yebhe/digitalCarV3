<template>
  <div
    class="container d-flex flex-column justify-content-center align-items-center min-vh-100 bg-0A1128 text-FEFCFB"
  >
    <div class="col-md-6">
      <div class="card p-4 shadow-lg bg-034078">
        <h2 class="card-title text-center text-1282A2">Inscription</h2>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="username" class="form-label text-white">Nom d'utilisateur</label>
            <input
              type="text"
              v-model="username"
              class="form-control"
              id="username"
              placeholder="Entrez votre nom d'utilisateur"
              required
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label text-white">Adresse Email</label>
            <input
              type="email"
              v-model="email"
              class="form-control"
              id="email"
              placeholder="Entrez votre adresse email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label text-white">Mot de Passe</label>
            <input
              type="password"
              v-model="password"
              class="form-control"
              id="password"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="isLoading"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
            ></span>
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      errorMessage: "",
      isLoading: false,
    };
  },
  methods: {
    async register() {
      this.isLoading = true;
      this.errorMessage = "";
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/register",
          {
            username: this.username,
            email: this.email,
            password: this.password,
          }
        );
        console.log(response.data);
        this.$router.push("/login");
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "Une erreur est survenue.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Couleurs personnalisées */
.bg-0A1128 {
  background-color: #0a1128; /* Couleur de fond */
}
.bg-034078 {
  background-color: #034078; /* Couleur de la carte */
}
.text-1282A2 {
  color: #1282a2; /* Texte accentué */
}
.text-FEFCFB {
  color: #fefcfb; /* Texte principal */
}

/* Style de la carte */
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

/* Responsivité : Largeur et ajustement */
@media (max-width: 768px) {
  .col-md-6 {
    width: 100%; /* Largeur totale pour petits écrans */
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 20px; /* Un peu d'espace pour petits écrans */
  }
}
</style>
