export interface Empleado {
  Nombre: string;
  Apellido: string;
  DNI: number;
  Domicilio: string;
}

export interface EmpleadoWithKey extends Empleado {
  key: string | null;
}
