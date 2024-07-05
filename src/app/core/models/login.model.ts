// Clase para importar la interfaz del usuario.
// Es la respuesta del login.

export { LoginResponse, Data, UserData, User };

interface LoginResponse {
  status: string;
  message: string;
  data: Data;
}

interface Data {
  data: UserData;
}

interface UserData {
  user: User;
}

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
}
