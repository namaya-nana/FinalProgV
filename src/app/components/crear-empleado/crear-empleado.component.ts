import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empleado } from 'src/app/models/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-empleado',
  templateUrl: './crear-empleado.component.html',
  styleUrls: ['./crear-empleado.component.css']
})
export class CrearEmpleadoComponent {
  empleadoForm: FormGroup;

  constructor(private fb: FormBuilder, private empleadoService: EmpleadoService, private router: Router) { 
      this.empleadoForm = this.fb.group({
          Nombre: ['', Validators.required],
          Apellido: ['', Validators.required],
          DNI: ['', Validators.required],
          Domicilio: ['', Validators.required],
      })
  }

  ngOnInit(): void {}

  // Agregar un nuevo empleado
  agregarEmpleado() {
    const nombreControl = this.empleadoForm.get('Nombre');
    const apellidoControl = this.empleadoForm.get('Apellido');
    const dniControl = this.empleadoForm.get('DNI');
    const domicilioControl = this.empleadoForm.get('Domicilio');

    if (nombreControl && apellidoControl && dniControl && domicilioControl) {
      const nuevoEmpleado: Empleado = {
        Nombre: nombreControl.value,
        Apellido: apellidoControl.value,
        DNI: dniControl.value,
        Domicilio: domicilioControl.value,
      };

      // Llamar al servicio para agregar el empleado
      this.empleadoService.agregarEmpleado(nuevoEmpleado).then(() => {
        // Limpiar el formulario después de agregar el empleado
        this.empleadoForm.reset();
         // Redirigir a la vista de listar empleados
        this.router.navigate(['']); // Ruta configurada como '' en tu AppRoutingModule    
        
      }).catch(error => {
        console.error('Error al agregar empleado:', error);
        // Manejar el error de manera apropiada (puedes mostrar un mensaje al usuario, etc.)
      });
    } else {
      // Marcar campos del formulario como tocados para mostrar mensajes de validación
      this.empleadoForm.markAllAsTouched();
    }
  }
}
