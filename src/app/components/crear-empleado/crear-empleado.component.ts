import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empleado, EmpleadoWithKey } from 'src/app/models/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-crear-empleado',
  templateUrl: './crear-empleado.component.html',
  styleUrls: ['./crear-empleado.component.css']
})
export class CrearEmpleadoComponent {
  empleadoForm: FormGroup;
  //agregados 
  isEditMode: boolean = false;
  empleadoAModificar: EmpleadoWithKey | null = null;

  constructor(private fb: FormBuilder, 
    private empleadoService: EmpleadoService, 
    private router: Router,  // Cambia ActivatedRoute por Router
    private route: ActivatedRoute,
    private toastr: ToastrService) { 
      this.empleadoForm = this.fb.group({
          Nombre: ['', Validators.required],
          Apellido: ['', Validators.required],
          DNI: ['', Validators.required],
          Domicilio: ['', Validators.required],
      })
  }

  ngOnInit() {
    // Verificar si se proporciona un 'key' en la ruta para determinar si estás en modo edición
    this.route.params.subscribe(params => {
      if (params['key']) {
        const empleadoKey = params['key'];
        this.isEditMode = true;
  
        // Obtener el empleado a editar y cargar sus datos en el formulario
        this.empleadoService.getEmpleadoById(empleadoKey).subscribe(empleado => {
          if (empleado) {
            this.empleadoAModificar = empleado;
            this.empleadoForm.setValue({
              Nombre: empleado.Nombre,
              Apellido: empleado.Apellido,
              DNI: empleado.DNI,
              Domicilio: empleado.Domicilio
            });
          } else {
            console.error('El empleado no fue encontrado.');
          }
        });
      }
    });
  }

  agregarOEditarEmpleado(): void {
    if (this.isEditMode && this.empleadoAModificar !== null) {
      const empleadoEditado: EmpleadoWithKey = {
        ...this.empleadoAModificar,
        ...this.empleadoForm.value
      };

      this.empleadoService.editarEmpleado(empleadoEditado).then(() => {
        this.toastr.success('Empleado editado con éxito', 'Editado');
        this.router.navigate(['']); // Redirigir a la vista de listar empleados
      }).catch(error => {
        console.error('Error al editar el empleado:', error);
        this.toastr.error('Error al editar el empleado', 'Error');
      });
    } else {
      const nuevoEmpleado: Empleado = this.empleadoForm.value;

      this.empleadoService.agregarEmpleado(nuevoEmpleado).then(() => {
        this.toastr.success('Empleado agregado con éxito', 'Agregado');
        this.router.navigate(['']); // Redirigir a la vista de listar empleados
      }).catch(error => {
        console.error('Error al agregar el empleado:', error);
        this.toastr.error('Error al agregar el empleado', 'Error');
      });
    }
  }
}
