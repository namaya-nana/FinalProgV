import { Component, OnInit  } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Empleado, EmpleadoWithKey } from 'src/app/models/empleado';
import { ActivatedRoute, Router } from '@angular/router';  // Importa ActivatedRoute y Router


@Component({
  selector: 'app-listar-empleado',
  templateUrl: './listar-empleado.component.html',
  styleUrls: ['./listar-empleado.component.css']
})

export class ListarEmpleadoComponent implements OnInit {
  empleados$: Observable<EmpleadoWithKey[]>;
  // Agregar una propiedad para el empleado que se está modificando
  empleadoAModificar: EmpleadoWithKey | null = null;

  constructor(private empleadoService: EmpleadoService, 
    private toastr: ToastrService,
    private router: Router, 
    private route: ActivatedRoute
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
        
      }).catch(error => {
        console.error('Error al eliminar el empleado:', error);
        this.toastr.error('Error al eliminar el empleado', 'Error');
      });
    }
  }
  seleccionarEmpleadoParaModificar(empleado: EmpleadoWithKey): void {
    this.router.navigate(['/crear-empleado', empleado.key]);
  }
  
}
  