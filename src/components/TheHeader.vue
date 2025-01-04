<template>
  <header class="navbar-custom py-4 shadow-sm fixed-top">
    <div class="container d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <img
          src="@/assets/car_logo.png"
          alt="Digital CarLogo"
          class="logo me-3"
        />
        <h1 class="h3 mb-0 text-FEFCFB">Digital Car</h1>
      </div>
      <nav class="d-flex align-items-center">
        <ul class="nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link text-FEFCFB">Accueil</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" class="nav-link text-FEFCFB">Contact</router-link>
          </li>
        </ul>
        <div>
          <!-- Affiche ces liens si l'utilisateur est déconnecté -->
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="btn btn-outline-light me-2">Connexion</router-link>
            <router-link to="/signup" class="btn btn-light">Inscription</router-link>
          </template>
          <!-- Affiche ces liens si l'utilisateur est connecté -->
          <template v-else>
            <router-link to="/brands" class="btn btn-outline-light me-2">Marques</router-link>
            <router-link to="/models" class="btn btn-outline-light me-2">Models</router-link>
            <router-link to="/adas-component" class="btn btn-outline-light me-2">Aads</router-link>
            <router-link to="/upload-pdf" class="btn btn-outline-light me-2">Charger pdf</router-link>
            <router-link to="/dashboard" class="btn btn-outline-light me-2">Dashboard</router-link>
            <button @click="logout" class="btn btn-light">Déconnexion</button>
            </template>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "TheHeader",
  data() {
    return {
      // Vérifie si l'utilisateur est connecté en utilisant localStorage
      isLoggedIn: !!localStorage.getItem('token'),
    };
  },
  methods: {
    logout() {
      // Supprimer le token de localStorage pour déconnecter l'utilisateur
      localStorage.removeItem('token');
      // Redirige l'utilisateur vers la page d'accueil après la déconnexion
      this.$router.push('/');
      // Met à jour l'état de la connexion
      this.isLoggedIn = false;
    },
  },
};
</script>

<style scoped>
.logo {
  width: 40px;
  height: auto;
}
.navbar-custom {
  background-color: #000; /* Couleur noire pour la navbar */
  padding-top: 1rem; /* Agrandir vers le bas */
  padding-bottom: 1rem; /* Agrandir vers le bas */
}
.nav-link {
  color: #fefcfb; /* Couleur spécifiée */
}
</style>
