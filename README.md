# Analizador Matricial Estructural - Matemática Superior

Este proyecto es una plataforma interactiva web diseñada para la automatización, cálculo y desglose pedagógico de operaciones matriciales (hasta orden 4x4), desarrollada como proyecto final para el curso de **Matemática Superior**.

## 🧬 Fundamento Tecnológico e Integración LaTeX
El núcleo del software utiliza la especificación **LaTeX** para el renderizado científico formal de datos mediante la API matemática **KaTeX**. Esto garantiza que las estructuras lineales se muestren bajo la notación algebraica universal (entornos `pmatrix`, notación de sumatorias `\sum` y operadores determinantes `|A|`).

## 🚀 Funcionalidades Principales
- **Entrada Bidimensional Adaptable:** Selección independiente de filas ($m$) y columnas ($n$) dinámica para PC y dispositivos móviles.
- **Inspector de Propiedades:** Detección automatizada de tipologías (Matriz Cuadrada, Rectangular, Simétrica, Identidad, Nula).
- **Operadores Unarios con Desglose:** Cálculo de la Matriz Transpuesta ($A^T$) y Traza ($\text{tr}(A)$) con justificación teórica explícita.
- **Motor de Determinantes Paso a Paso:** 
  - Dimensión $2 \times 2$: Multiplicación cruzada directa.
  - Dimensión $3 \times 3$: Aplicación geométrica de la **Regla de Sarrus**.
  - Dimensión $4 \times 4$: Reducción mediante el **Teorema de Expansión por Cofactores de Laplace**.
