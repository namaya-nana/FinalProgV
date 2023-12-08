import { Component, OnInit  } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Empleado, EmpleadoWithKey } from 'src/app/models/empleado';

@Component({
  selector: 'app-listar-empleado',
  templateUrl: './listar-empleado.component.html',
  styleUrls: ['./listar-empleado.component.css']
})

export class ListarEmpleadoComponent implements OnInit {
  empleados$: Observable<EmpleadoWithKey[]>;
  // Agregar una propiedad para el empleado que se está modificando
  empleadoAModificar: EmpleadoWithKey | null = null;
  constructor(private empleadoService: EmpleadoService, private toastr: ToastrService
   ) {
    this.empleados$ = new Observable<EmpleadoWithKey[]>();
  }

  ngOnInit() {
    this.empleados$ = this.empleadoService.getEmpleados();
  }

  eliminarEmpleado(empleado: EmpleadoWithKey): void {
    console.log('Empleado a eliminar:', empleado);
  
    if (empleado.key !== null && confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      console.log('Eliminando empleado con key:', empleado.key);
      this.empleadoService.eliminarEmpleado(empleado.key).then(() => {
        console.log('Empleado eliminado con éxito');
        this.toastr.success('Empleado eliminado con éxito', 'Eliminado');
        // Puedes realizar acciones adicionales después de eliminar el empleado
      }).catch(error => {
        console.error('Error al eliminar el empleado:', error);
        this.toastr.error('Error al eliminar el empleado', 'Error');
      });
    }
  }

  // Método para seleccionar un empleado para modificar
  seleccionarEmpleadoParaModificar(empleado: EmpleadoWithKey): void {
    this.empleadoAModificar = { ...empleado }; // Hacer una copia para evitar cambiar el original directamente
  }

  // Método para cancelar la modificación
  cancelarModificacion(): void {
    this.empleadoAModificar = null;
  }

  // Método para guardar la modificación
  guardarModificacion(): void {
    if (this.empleadoAModificar !== null) {
      // Lógica para guardar la modificación, puedes usar this.empleadoService.modificarEmpleado(...)
      console.log('Empleado modificado con éxito');
      this.toastr.success('Empleado modificado con éxito', 'Modificado');

      // Limpiar el empleadoAModificar después de la modificación
      this.empleadoAModificar = null;
    }
  }
  
}