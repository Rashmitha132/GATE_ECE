// 15 New GATE ECE Topics for Engineering Mathematics
import { TopicItem } from './types';

export const mathematicsTopics: TopicItem[] = [
  {
    "title": "Matrix Rank, Nullity, and Systems of Linear Equations (AX = B)",
    "summary": "Row echelon form, rank-nullity theorem, Rouche-Capelli consistency conditions, unique vs infinite vs no solutions, and homogeneous systems.",
    "orderIndex": 11,
    "lesson": {
      "intro": "The Rank of a matrix represents the maximum number of linearly independent row or column vectors, governing the consistency and dimension of solution spaces for linear systems AX = B through the Rouche-Capelli Theorem.",
      "simple": "When solving multiple simultaneous equations, rank tells you how many equations are providing genuinely new information instead of repeating what other equations already said. If you have 3 unknowns and 3 independent equations, there is exactly one solution.",
      "why": "Testing whether a linear system has a unique solution, infinitely many solutions, or no solution (inconsistency) appears in almost every GATE Mathematics paper.",
      "points": [
        "Rank r(A): Maximum number of non-zero rows in the row-echelon form of matrix A.",
        "Rank-Nullity Theorem: For an m x n matrix A: Rank(A) + Nullity(A) = n (number of columns / variables).",
        "Non-Homogeneous System AX = B with augmented matrix [A | B]:",
        "1. Inconsistent (No Solution): Rank(A) != Rank([A | B]) (or Rank(A) < Rank([A | B])).",
        "2. Consistent with Unique Solution: Rank(A) = Rank([A | B]) = n (number of variables).",
        "3. Consistent with Infinitely Many Solutions: Rank(A) = Rank([A | B]) = r < n (there are n - r free variables).",
        "Homogeneous System AX = 0 (always consistent since X = 0 is trivial solution):",
        "- Unique Trivial Solution (X = 0): Rank(A) = n (or det(A) != 0 for square matrix).",
        "- Non-Trivial (Infinite) Solutions: Rank(A) < n (or det(A) = 0 for square matrix)."
      ],
      "formulas": [
        {
          "equation": "Rank(A) + Nullity(A) = n",
          "meaning": "Rank-Nullity Theorem where n is the number of columns (variables) of matrix A.",
          "conditions": "Linear transformation from R^n to R^m."
        },
        {
          "equation": "Rank(A) = Rank([A | B]) = r",
          "meaning": "Rouche-Capelli condition for consistency of system AX = B.",
          "conditions": "Unique if r = n; infinite solutions with (n - r) parameters if r < n."
        },
        {
          "equation": "det(A) = 0   <==>   Non-trivial solutions exist to AX = 0",
          "meaning": "Condition for existence of non-zero solutions to square homogeneous system.",
          "conditions": "Square n x n matrix A."
        }
      ],
      "example": {
        "question": "For what values of a and b does the system x + y + z = 6, x + 2y + 3z = 10, and x + 2y + a*z = b have: (i) no solution, (ii) a unique solution, and (iii) infinitely many solutions?",
        "given": [
          "System: x + y + z = 6",
          "x + 2y + 3z = 10",
          "x + 2y + a*z = b"
        ],
        "steps": [
          "Write augmented matrix [A | B]:",
          "[[1, 1, 1, 6], [1, 2, 3, 10], [1, 2, a, b]]",
          "Row operations: R2 -> R2 - R1, R3 -> R3 - R1:",
          "[[1, 1, 1, 6], [0, 1, 2, 4], [0, 1, a - 1, b - 6]]",
          "Row operation: R3 -> R3 - R2:",
          "[[1, 1, 1, 6], [0, 1, 2, 4], [0, 0, a - 3, b - 10]]",
          "Analysis of bottom row [0, 0, a - 3 | b - 10]:",
          "- Case (i) No Solution: a - 3 = 0 and b - 10 != 0 => a = 3 and b != 10 (Rank(A) = 2, Rank([A|B]) = 3).",
          "- Case (ii) Unique Solution: a - 3 != 0 => a != 3 (Rank(A) = Rank([A|B]) = 3 = n, for any b).",
          "- Case (iii) Infinitely Many Solutions: a - 3 = 0 and b - 10 = 0 => a = 3 and b = 10 (Rank(A) = Rank([A|B]) = 2 < 3)."
        ],
        "answer": "No solution: a=3, b!=10; Unique: a!=3, any b; Infinite solutions: a=3, b=10."
      },
      "gate": [
        "For square matrix A: AX = B has a unique solution if and only if det(A) != 0.",
        "Homogeneous system AX = 0 has a non-trivial solution if and only if det(A) = 0.",
        "Rank of product: Rank(A*B) <= min(Rank(A), Rank(B)).",
        "Rank(A^T * A) = Rank(A)."
      ],
      "mistakes": [
        "Assuming a system with 3 equations and 3 unknowns always has a unique solution; if det(A) = 0, it may have infinite solutions or zero solutions.",
        "Confusing row operations on [A | B] with column operations (column operations mix variable assignments and should not be used on augmented matrices)."
      ],
      "diagram": "math",
      "diagramTitle": "Rouche-Capelli Consistency Flowchart",
      "diagramCaption": "Decision tree comparing Rank(A) vs Rank([A|B]) leading to no solution, unique solution, or infinite solutions.",
      "studyGuide": [
        "Reduce matrices to row-echelon form using Gaussian elimination.",
        "Apply the Rank-Nullity theorem to find dimension of kernel/nullspace.",
        "Solve parametric GATE problems on system consistency."
      ],
      "practiceQuestions": [
        {
          "question": "A 3x4 matrix A has rank 2. The dimension of the null space (nullity) of matrix A is:",
          "type": "NAT",
          "answer": "2",
          "explanation": "Rank-Nullity theorem: Rank + Nullity = number of columns (n). Here n = 4 and Rank = 2, so Nullity = 4 - 2 = 2."
        },
        {
          "question": "The homogeneous system AX = 0 with an n x n matrix A has non-trivial (non-zero) solutions if and only if:",
          "type": "MCQ",
          "options": [
            "det(A) = 0",
            "det(A) != 0",
            "Rank(A) = n",
            "A is an orthogonal matrix"
          ],
          "answer": "det(A) = 0",
          "explanation": "Non-trivial solutions require the columns of A to be linearly dependent, which means det(A) = 0 (Rank(A) < n)."
        }
      ],
      "quickRevision": "Rank = number of non-zero rows in echelon form. Rank + Nullity = n (columns). AX = B: No solution if Rank(A) < Rank([A|B]). Unique if Rank(A) = Rank([A|B]) = n. Infinite if Rank(A) = Rank([A|B]) < n. AX = 0: Non-trivial solution if det(A) = 0.",
      "relatedTopics": [
        "Linear Algebra: Matrices and Eigenvalues",
        "Cayley-Hamilton Theorem and Matrix Inversion / Powers",
        "Controllability and Observability (Kalman & Gilbert Tests)"
      ]
    }
  },
  {
    "title": "Cayley-Hamilton Theorem and Matrix Inversion / Powers",
    "summary": "Every square matrix satisfies its own characteristic equation, computing A^-1, high powers A^k, and minimal polynomial.",
    "orderIndex": 12,
    "lesson": {
      "intro": "The Cayley-Hamilton Theorem states that every square matrix satisfies its own characteristic polynomial equation, providing an elegant algebraic shortcut to calculate matrix inverses, high powers A^k, and matrix exponentials.",
      "simple": "When you find the characteristic polynomial of a matrix by setting det(lambda*I - A) = 0, Cayley-Hamilton says you can replace lambda with the matrix A itself, and the entire equation will equal the zero matrix! This lets you express A^100 or A^-1 as a simple linear combination of lower powers.",
      "why": "Calculating high matrix powers and matrix inverses using Cayley-Hamilton is one of the most reliable scoring questions in GATE Engineering Mathematics.",
      "points": [
        "Characteristic polynomial: P(lambda) = det(lambda * I - A) = lambda^n + c_(n-1)*lambda^(n-1) + ... + c1*lambda + c0 = 0.",
        "Theorem statement: P(A) = A^n + c_(n-1)*A^(n-1) + ... + c1*A + c0*I = 0 (where 0 is the n x n null matrix).",
        "Matrix Inversion: If det(A) = (-1)^n * c0 != 0, multiplying P(A) by A^-1 gives:",
        "A^-1 = (-1 / c0) * [ A^(n-1) + c_(n-1)*A^(n-2) + ... + c1*I ].",
        "High Matrix Powers: Any power A^m (where m >= n) can be divided by P(A): A^m = Q(A)*P(A) + R(A) = R(A), reducing A^m to a polynomial of degree at most (n - 1).",
        "Minimal Polynomial: The monic polynomial m(lambda) of lowest degree such that m(A) = 0. Divides the characteristic polynomial P(lambda)."
      ],
      "formulas": [
        {
          "equation": "P(A) = A^n + c_{n-1}*A^{n-1} + ... + c_1*A + c_0*I = 0",
          "meaning": "Cayley-Hamilton Theorem statement.",
          "conditions": "Any n x n square matrix with real or complex entries."
        },
        {
          "equation": "A^{-1} = - (1 / c_0) * [ A^{n-1} + c_{n-1}*A^{n-2} + ... + c_1*I ]",
          "meaning": "Matrix inverse using Cayley-Hamilton theorem.",
          "conditions": "Matrix A is non-singular (c_0 = (-1)^n * det(A) != 0)."
        },
        {
          "equation": "lambda^m = q(lambda)*P(lambda) + r(lambda)   ==>   A^m = r(A)",
          "meaning": "Reduction of high powers A^m to degree <= (n - 1).",
          "conditions": "m >= n."
        }
      ],
      "example": {
        "question": "Given matrix A = [[2, 1], [1, 2]], verify the Cayley-Hamilton theorem, find A^-1, and calculate A^4.",
        "given": [
          "A = [[2, 1], [1, 2]]",
          "Dimension n = 2"
        ],
        "steps": [
          "Find characteristic polynomial: det(lambda*I - A) = (lambda - 2)^2 - 1 = lambda^2 - 4*lambda + 3 = 0",
          "Apply Cayley-Hamilton: A^2 - 4*A + 3*I = 0",
          "Matrix Inversion: Multiply by A^-1 => A - 4*I + 3*A^-1 = 0",
          "Solve for A^-1: 3*A^-1 = 4*I - A => A^-1 = (1/3) * (4*I - A)",
          "A^-1 = (1/3) * [ [[4, 0], [0, 4]] - [[2, 1], [1, 2]] ] = (1/3) * [[2, -1], [-1, 2]]",
          "High power A^4: Eigenvalues are roots of lambda^2 - 4*lambda + 3 = 0 => lambda1 = 1, lambda2 = 3",
          "Let lambda^4 = (lambda^2 - 4*lambda + 3)*q(lambda) + (c1*lambda + c0)",
          "At lambda = 1: 1^4 = c1*(1) + c0 => c1 + c0 = 1",
          "At lambda = 3: 3^4 = 81 = c1*(3) + c0 => 3*c1 + c0 = 81",
          "Subtract equations: 2*c1 = 80 => c1 = 40, c0 = 1 - 40 = -39",
          "Therefore A^4 = 40*A - 39*I = 40*[[2, 1], [1, 2]] - 39*[[1, 0], [0, 1]] = [[80-39, 40], [40, 80-39]] = [[41, 40], [40, 41]]"
        ],
        "answer": "A^-1 = [[2/3, -1/3], [-1/3, 2/3]]; A^4 = [[41, 40], [40, 41]]."
      },
      "gate": [
        "For a 2x2 matrix: Characteristic equation is lambda^2 - Trace(A)*lambda + det(A) = 0.",
        "Therefore, A^2 - Trace(A)*A + det(A)*I = 0 ALWAYS for any 2x2 matrix!",
        "Eigenvalues of A^k are simply (lambda_i)^k, and eigenvalues of A^-1 are 1 / lambda_i."
      ],
      "mistakes": [
        "Forgetting the identity matrix I on the constant term: writing A^2 - 4*A + 3 = 0 is notationally wrong (cannot add scalar 3 to matrix A^2). Must write 3*I.",
        "Using Cayley-Hamilton on non-square matrices (it applies ONLY to square matrices)."
      ],
      "diagram": "math",
      "diagramTitle": "Cayley-Hamilton Matrix Power Reduction Sequence",
      "diagramCaption": "Mapping characteristic polynomial roots to reduce polynomial degree of matrix functions.",
      "studyGuide": [
        "Quickly write characteristic equations of 2x2 and 3x3 matrices using Trace and Determinant.",
        "Compute matrix inverses without evaluating matrix of cofactors.",
        "Evaluate matrix exponentials exp(At) using Cayley-Hamilton in control systems."
      ],
      "practiceQuestions": [
        {
          "question": "A 2x2 matrix A has Trace(A) = 5 and det(A) = 6. Which matrix equation does A satisfy?",
          "type": "MCQ",
          "options": [
            "A^2 - 5*A + 6*I = 0",
            "A^2 + 5*A + 6*I = 0",
            "A^2 - 6*A + 5*I = 0",
            "A^2 - 5*A - 6*I = 0"
          ],
          "answer": "A^2 - 5*A + 6*I = 0",
          "explanation": "Characteristic equation of any 2x2 matrix is lambda^2 - Trace(A)*lambda + det(A) = 0. By Cayley-Hamilton, A^2 - 5*A + 6*I = 0."
        },
        {
          "question": "If A = [[1, 0], [0, 2]], the (2,2) entry of matrix A^5 is:",
          "type": "NAT",
          "answer": "32",
          "explanation": "For a diagonal matrix, A^k is obtained by raising each diagonal element to the power k. Here 2^5 = 32."
        }
      ],
      "quickRevision": "Cayley-Hamilton: P(A) = 0. For 2x2: A^2 - Trace(A)*A + det(A)*I = 0. Inversion: A^-1 = (1/det(A))*(Trace(A)*I - A). High powers A^k reduced via remainder r(lambda). Eigenvalues of A^k are lambda_i^k.",
      "relatedTopics": [
        "Linear Algebra: Matrices and Eigenvalues",
        "Matrix Rank, Nullity, and Systems of Linear Equations (AX = B)",
        "State Transition Matrix: Properties and Computation Methods"
      ]
    }
  },
  {
    "title": "Mean Value Theorems: Rolle's, Lagrange's, and Cauchy's MVT",
    "summary": "Hypothesis and geometric interpretation of Rolle's theorem, Lagrange's MVT, Cauchy's generalized MVT, and root isolation.",
    "orderIndex": 13,
    "lesson": {
      "intro": "Mean Value Theorems (Rolle's, Lagrange's, and Cauchy's) establish rigorous mathematical links between the global average rate of change of a function over an interval and its local instantaneous derivative at an interior point.",
      "simple": "If you drive 100 km in exactly 1 hour on a toll road, your average speed is 100 km/h. Lagrange's theorem guarantees that at least once during your trip, your speedometer needle pointed at exactly 100 km/h.",
      "why": "Proving roots of equations, error bounds in Taylor series approximations, and L'Hopital's rule derivations rely directly on Mean Value Theorems.",
      "points": [
        "Rolle's Theorem conditions: If f(x) is: 1. Continuous on [a, b], 2. Differentiable on (a, b), and 3. f(a) = f(b), then there exists at least one c in (a, b) such that f'(c) = 0.",
        "Geometric meaning of Rolle's: The tangent line to the curve is horizontal (parallel to x-axis) at x = c.",
        "Lagrange's Mean Value Theorem (LMVT): If f(x) is continuous on [a, b] and differentiable on (a, b), then there exists at least one c in (a, b) such that:",
        "f'(c) = [ f(b) - f(a) ] / (b - a).",
        "Geometric meaning of LMVT: The tangent line at x = c is parallel to the secant line connecting endpoints (a, f(a)) and (b, f(b)).",
        "Cauchy's Mean Value Theorem: For two functions f(x) and g(x): [ f(b) - f(a) ] / [ g(b) - g(a) ] = f'(c) / g'(c) for some c in (a, b).",
        "Root Isolation: Between any two real roots of f(x) = 0, there lies at least one real root of its derivative f'(x) = 0."
      ],
      "formulas": [
        {
          "equation": "f'(c) = 0,   for some c in (a, b)",
          "meaning": "Rolle's Theorem conclusion.",
          "conditions": "Continuous on [a, b], differentiable on (a, b), and f(a) = f(b)."
        },
        {
          "equation": "f'(c) = [ f(b) - f(a) ] / (b - a),   c in (a, b)",
          "meaning": "Lagrange's Mean Value Theorem.",
          "conditions": "Continuous on [a, b], differentiable on (a, b)."
        },
        {
          "equation": "[ f(b) - f(a) ] / [ g(b) - g(a) ] = f'(c) / g'(c)",
          "meaning": "Cauchy's Generalized Mean Value Theorem.",
          "conditions": "Continuous on [a, b], differentiable on (a, b), g'(x) != 0 on (a, b)."
        }
      ],
      "example": {
        "question": "Verify Lagrange's Mean Value Theorem for f(x) = x^3 - 3*x on the interval [0, 2], and find the value of c in the open interval (0, 2).",
        "given": [
          "f(x) = x^3 - 3*x",
          "Interval [a, b] = [0, 2]"
        ],
        "steps": [
          "f(x) is a polynomial, so it is continuous on [0, 2] and differentiable on (0, 2).",
          "Evaluate at endpoints: f(0) = 0^3 - 3*(0) = 0",
          "f(2) = 2^3 - 3*(2) = 8 - 6 = 2",
          "Average slope: [ f(b) - f(a) ] / (b - a) = (2 - 0) / (2 - 0) = 2 / 2 = 1",
          "Differentiate f(x): f'(x) = 3*x^2 - 3",
          "Apply LMVT: f'(c) = 1 => 3*c^2 - 3 = 1",
          "Solve for c: 3*c^2 = 4 => c^2 = 4/3 => c = 2 / sqrt(3) approx 1.155",
          "Check interval: 1.155 lies inside the open interval (0, 2)."
        ],
        "answer": "LMVT is verified; c = 2 / sqrt(3) approx 1.155."
      },
      "gate": [
        "The point c MUST lie in the OPEN interval (a, b); c cannot be an endpoint!",
        "Differentiability is required ONLY on the OPEN interval (a, b); continuity is required on the CLOSED interval [a, b].",
        "If f(x) has a sharp corner (like |x| at x = 0), differentiability fails and MVT cannot be applied."
      ],
      "mistakes": [
        "Accepting solutions for c that lie outside the interval (a, b).",
        "Applying Rolle's theorem when f(a) != f(b)."
      ],
      "diagram": "math",
      "diagramTitle": "Rolle's and Lagrange's MVT Geometric Secant/Tangent",
      "diagramCaption": "Graph showing parallel tangent lines at x=c matching the secant slope (LMVT) or zero slope (Rolle's).",
      "studyGuide": [
        "Check all three hypotheses of Rolle's theorem before calculating c.",
        "Apply MVT to prove inequalities like sin(x) < x for x > 0.",
        "Use Rolle's theorem to bound the number of real roots of polynomials."
      ],
      "practiceQuestions": [
        {
          "question": "For f(x) = x^2 - 4*x on the interval [0, 4], find the value of c that satisfies Rolle's theorem.",
          "type": "NAT",
          "answer": "2",
          "explanation": "f(0) = 0 and f(4) = 16 - 16 = 0, so f(0) = f(4). f'(x) = 2x - 4 = 0 => 2c = 4 => c = 2, which lies in (0, 4)."
        },
        {
          "question": "Between any two consecutive real roots of a differentiable function f(x), there exists at least one real root of:",
          "type": "MCQ",
          "options": [
            "f'(x) = 0",
            "f''(x) = 0",
            "integral f(x) dx = 0",
            "f(x) + f'(x) = 0"
          ],
          "answer": "f'(x) = 0",
          "explanation": "By Rolle's theorem, if f(x1) = 0 and f(x2) = 0, then f'(c) = 0 for at least one point c between x1 and x2."
        }
      ],
      "quickRevision": "Rolle's: cont on [a, b], diff on (a, b), f(a)=f(b) => f'(c)=0. Lagrange: f'(c) = [f(b)-f(a)]/(b-a). Cauchy: [f(b)-f(a)]/[g(b)-g(a)] = f'(c)/g'(c). Point c MUST lie strictly inside open interval (a, b).",
      "relatedTopics": [
        "Calculus: Limits and Derivatives",
        "Integration and Applications",
        "Maxima, Minima, and Saddle Points of Multi-Variable Functions"
      ]
    }
  },
  {
    "title": "Maxima, Minima, and Saddle Points of Multi-Variable Functions",
    "summary": "Stationary points, gradient grad(f) = 0, Hessian matrix, discriminant Delta = r*t - s^2, local extrema, and constrained extrema via Lagrange multipliers.",
    "orderIndex": 14,
    "lesson": {
      "intro": "Optimizing multi-variable functions f(x, y) requires identifying critical stationary points where the gradient vanishes, and classifying them as local minima, local maxima, or saddle points using the second-order partial derivative test (Hessian matrix).",
      "simple": "Imagine standing on a mountain terrain: a peak is a local maximum (curving down in all directions), a bowl is a local minimum (curving up in all directions), and a mountain pass (horse saddle) curves up one way and down the other: that is a saddle point.",
      "why": "Optimization algorithms, machine learning loss surface analysis, and constrained engineering optimization rely fundamentally on multi-variable extrema tests.",
      "points": [
        "Critical Point Condition: Both first partial derivatives must vanish simultaneously: fx = partial(f)/partial(x) = 0, and fy = partial(f)/partial(y) = 0.",
        "Second Partial Derivative Definitions: r = fxx, s = fxy, t = fyy.",
        "Discriminant (Hessian Determinant): Delta = r * t - s^2 = (fxx * fyy) - (fxy)^2.",
        "Classification Criteria:",
        "1. If Delta > 0 and r > 0 (or t > 0): Local Minimum (positive definite Hessian).",
        "2. If Delta > 0 and r < 0 (or t < 0): Local Maximum (negative definite Hessian).",
        "3. If Delta < 0: Saddle Point (indefinite Hessian, neither max nor min).",
        "4. If Delta = 0: Test is Inconclusive (higher-order derivatives required).",
        "Lagrange Multipliers: For optimizing f(x, y) subject to constraint g(x, y) = 0: grad(f) = lambda * grad(g)."
      ],
      "formulas": [
        {
          "equation": "Delta = f_{xx} * f_{yy} - (f_{xy})^2 = r * t - s^2",
          "meaning": "Discriminant (Hessian determinant) for function f(x, y).",
          "conditions": "Continuous second partial derivatives."
        },
        {
          "equation": "Delta > 0,   r > 0   ==>   Local Minimum",
          "meaning": "Condition for strictly convex local minimum.",
          "conditions": "Hessian matrix is positive definite."
        },
        {
          "equation": "Delta < 0   ==>   Saddle Point",
          "meaning": "Condition for saddle point.",
          "conditions": "Opposite signs of principal curvatures."
        }
      ],
      "example": {
        "question": "Find and classify all stationary points of the function f(x, y) = x^3 + y^3 - 3*x - 12*y + 20.",
        "given": [
          "f(x, y) = x^3 + y^3 - 3*x - 12*y + 20"
        ],
        "steps": [
          "First partial derivatives: fx = 3*x^2 - 3, fy = 3*y^2 - 12",
          "Set to zero: 3*x^2 = 3 => x = +/- 1; 3*y^2 = 12 => y = +/- 2",
          "Four stationary points: (1, 2), (1, -2), (-1, 2), (-1, -2)",
          "Second partial derivatives: r = fxx = 6*x, s = fxy = 0, t = fyy = 6*y",
          "Discriminant: Delta = r*t - s^2 = (6*x)*(6*y) - 0 = 36 * x * y",
          "Evaluate each point:",
          "1. At (1, 2): Delta = 36*(1)*(2) = +72 > 0. r = 6*(1) = +6 > 0 => LOCAL MINIMUM.",
          "2. At (-1, -2): Delta = 36*(-1)*(-2) = +72 > 0. r = 6*(-1) = -6 < 0 => LOCAL MAXIMUM.",
          "3. At (1, -2): Delta = 36*(1)*(-2) = -72 < 0 => SADDLE POINT.",
          "4. At (-1, 2): Delta = 36*(-1)*(2) = -72 < 0 => SADDLE POINT."
        ],
        "answer": "Local min at (1, 2); Local max at (-1, -2); Saddle points at (1, -2) and (-1, 2)."
      },
      "gate": [
        "If Delta < 0, the point is GUARANTEED to be a Saddle Point immediately, regardless of r or t!",
        "If Delta = 0, no conclusion can be drawn from second derivatives.",
        "For n-variables, check eigenvalues of the Hessian matrix H: all positive eigenvalues => local min; all negative => local max; mixed signs => saddle point."
      ],
      "mistakes": [
        "Forgetting to square fxy in the discriminant: Delta = r*t - s^2, NOT r*t - s.",
        "Concluding local extrema when Delta < 0; Delta < 0 is ALWAYS a saddle point."
      ],
      "diagram": "math",
      "diagramTitle": "Hessian Classification Surface Geometry",
      "diagramCaption": "3D surfaces illustrating local minimum (paraboloid up), local maximum (paraboloid down), and saddle point (hyperbolic).",
      "studyGuide": [
        "Find critical points by solving simultaneous non-linear gradient equations.",
        "Construct the Hessian matrix and compute its determinant and trace.",
        "Apply Lagrange multipliers to solve constrained geometric and physical optimization problems."
      ],
      "practiceQuestions": [
        {
          "question": "For the function f(x, y) = x^2 - y^2, the point (0, 0) is a:",
          "type": "MCQ",
          "options": [
            "Saddle point",
            "Local minimum",
            "Local maximum",
            "Point of inflection"
          ],
          "answer": "Saddle point",
          "explanation": "fx = 2x = 0, fy = -2y = 0 => (0, 0). fxx = 2, fyy = -2, fxy = 0. Delta = (2)*(-2) - 0 = -4 < 0. Since Delta < 0, (0, 0) is a saddle point."
        },
        {
          "question": "If at a stationary point of f(x, y), fxx = 4, fyy = 9, and fxy = 5, the point is classified as a:",
          "type": "MCQ",
          "options": [
            "Local minimum",
            "Local maximum",
            "Saddle point",
            "Inconclusive"
          ],
          "answer": "Local minimum",
          "explanation": "Delta = fxx*fyy - (fxy)^2 = (4)*(9) - 5^2 = 36 - 25 = 11 > 0. Since Delta > 0 and fxx = 4 > 0, the point is a local minimum."
        }
      ],
      "quickRevision": "Critical points: fx = 0, fy = 0. r = fxx, s = fxy, t = fyy. Delta = r*t - s^2. If Delta > 0 and r > 0: Local Min. If Delta > 0 and r < 0: Local Max. If Delta < 0: Saddle Point. If Delta = 0: Inconclusive.",
      "relatedTopics": [
        "Calculus: Limits and Derivatives",
        "Mean Value Theorems: Rolle's, Lagrange's, and Cauchy's MVT",
        "Multiple Integrals: Double, Triple, and Change of Variables (Jacobian)"
      ]
    }
  },
  {
    "title": "Multiple Integrals: Double, Triple, and Change of Variables (Jacobian)",
    "summary": "Double integrals over non-rectangular regions, reversing order of integration, polar/cylindrical coordinates, and the Jacobian determinant J.",
    "orderIndex": 15,
    "lesson": {
      "intro": "Multiple integrals extend integration to 2D areas and 3D volumes, where changing coordinate systems (Cartesian to Polar, Cylindrical, or Spherical) requires scaling the differential area or volume element by the Jacobian determinant J.",
      "simple": "When you switch from square grid coordinates (x, y) to radar circle coordinates (r, theta), your little grid squares get stretched wider the further out you go. The Jacobian J = r is the stretching factor that accounts for this expanding wedge size: dx dy becomes r dr dtheta.",
      "why": "Calculating charge distributions, moments of inertia, and probability mass over 2D/3D domains relies on multiple integrals and Jacobians.",
      "points": [
        "Double Integral over Region R: integral integral_R f(x, y) dx dy represents the volume under surface z = f(x, y) over base area R.",
        "Reversing the Order of Integration: When an integral is difficult in the order dy dx, sketching the region and switching to dx dy can make it trivial to evaluate.",
        "Change of Variables: Transform variables from (x, y) to (u, v): dx dy = |J| du dv.",
        "Jacobian Determinant: J = partial(x, y) / partial(u, v) = det([[partial x/partial u, partial x/partial v], [partial y/partial u, partial y/partial v]]).",
        "Polar Coordinates: x = r*cos(theta), y = r*sin(theta). Jacobian J = r. Area element: dx dy = r dr dtheta.",
        "Cylindrical Coordinates: x = r*cos(theta), y = r*sin(theta), z = z. Volume element: dV = r dr dtheta dz.",
        "Spherical Coordinates: x = r*sin(theta)*cos(phi), y = r*sin(theta)*sin(phi), z = r*cos(theta). Volume element: dV = r^2 * sin(theta) dr dtheta dphi."
      ],
      "formulas": [
        {
          "equation": "J = det [ [partial x/partial u, partial x/partial v], [partial y/partial u, partial y/partial v] ]",
          "meaning": "Jacobian matrix determinant for 2D change of variables.",
          "conditions": "Continuously differentiable bijective coordinate mapping."
        },
        {
          "equation": "dx dy = r dr dtheta",
          "meaning": "Differential area element in polar coordinates.",
          "conditions": "Cartesian to Polar transformation."
        },
        {
          "equation": "dV = r^2 * sin(theta) dr dtheta dphi",
          "meaning": "Differential volume element in spherical coordinates.",
          "conditions": "Cartesian to Spherical transformation."
        }
      ],
      "example": {
        "question": "Evaluate the integral I = integral_0^infinity integral_0^infinity exp(-(x^2 + y^2)) dx dy by converting to polar coordinates.",
        "given": [
          "I = integral_0^inf integral_0^inf exp(-(x^2 + y^2)) dx dy",
          "First quadrant: x in [0, inf), y in [0, inf)"
        ],
        "steps": [
          "In polar coordinates: x^2 + y^2 = r^2, and dx dy = r dr dtheta",
          "First quadrant boundaries: r goes from 0 to infinity, theta goes from 0 to pi/2",
          "Transformed integral: I = integral_0^(pi/2) dtheta * integral_0^infinity exp(-r^2) * r dr",
          "Angular integral: integral_0^(pi/2) dtheta = pi / 2",
          "Radial integral: Let u = r^2 => du = 2*r dr => r dr = du / 2",
          "integral_0^inf exp(-u) * (du / 2) = (1/2) * [-exp(-u)]_0^inf = (1/2) * (0 - (-1)) = 1/2",
          "Multiply: I = (pi / 2) * (1 / 2) = pi / 4",
          "(Note: Since I = [integral_0^inf exp(-x^2) dx]^2 = pi/4, this proves the Gaussian integral integral_0^inf exp(-x^2) dx = sqrt(pi)/2!)"
        ],
        "answer": "The value of the double integral is pi / 4."
      },
      "gate": [
        "NEVER forget the extra r in polar coordinates (r dr dtheta); integrating exp(-r^2) dr dtheta without r is wrong!",
        "In spherical coordinates, the Jacobian is r^2 * sin(theta), NOT r^2.",
        "When reversing the order of integration, ALWAYS sketch the geometric boundary region first."
      ],
      "mistakes": [
        "Using the old Cartesian integration limits after converting to polar coordinates.",
        "Omitting the absolute value on the Jacobian determinant if J happens to be negative."
      ],
      "diagram": "math",
      "diagramTitle": "Change of Variables: Cartesian to Polar Wedge",
      "diagramCaption": "Cartesian rectangle dx dy transformed into polar wedge of area r dr dtheta.",
      "studyGuide": [
        "Practice reversing the order of integration for triangular and parabolic regions.",
        "Evaluate Gaussian integrals using double integrals in polar coordinates.",
        "Compute volumes of ellipsoids and cylinders using 3D Jacobians."
      ],
      "practiceQuestions": [
        {
          "question": "What is the Jacobian determinant J = partial(x, y) / partial(r, theta) for the polar transformation x = r*cos(theta), y = r*sin(theta)?",
          "type": "MCQ",
          "options": [
            "r",
            "r^2",
            "1",
            "r * sin(theta)"
          ],
          "answer": "r",
          "explanation": "J = det([[cos(t), -r*sin(t)], [sin(t), r*cos(t)]]) = r*cos^2(t) - (-r*sin^2(t)) = r*(cos^2 + sin^2) = r."
        },
        {
          "question": "The area of the circle x^2 + y^2 <= 9 evaluated using polar double integration is:",
          "type": "NAT",
          "answer": "28.27",
          "explanation": "Radius R = 3. Area = integral_0^(2*pi) dtheta * integral_0^3 r dr = 2*pi * [r^2 / 2]_0^3 = 2*pi * (9 / 2) = 9*pi approx 28.27."
        }
      ],
      "quickRevision": "Double integrals: area/volume. Change of variables: dx dy = |J| du dv. Polar: dx dy = r dr dtheta. Cylindrical: dV = r dr dtheta dz. Spherical: dV = r^2 * sin(theta) dr dtheta dphi. Gaussian integral = sqrt(pi).",
      "relatedTopics": [
        "Integration and Applications",
        "Vector Integral Theorems: Green's, Stokes', and Gauss Divergence Theorems",
        "Probability and Statistics"
      ]
    }
  },
  {
    "title": "Vector Integral Theorems: Green's, Stokes', and Gauss Divergence Theorems",
    "summary": "Line, surface, and volume integrals, Green's theorem in the plane, Stokes' theorem curl-flux equivalence, and Gauss divergence theorem.",
    "orderIndex": 16,
    "lesson": {
      "intro": "The three fundamental vector integral theorems\u2014Green's, Stokes', and Gauss's Divergence Theorems\u2014unify vector calculus by establishing equivalences between boundary integrals of lower dimension and domain integrals of one higher dimension.",
      "simple": "Gauss's Divergence theorem says: all the water leaking out through the surface of a closed balloon equals the sum of all water fountains spraying inside. Stokes' theorem says: walking around the perimeter fence of a farm measures the exact same swirl as summing all the tiny whirlpools across the farm's surface.",
      "why": "Maxwell's equations, electrostatic flux, magnetostatic circulations, and fluid flow calculations rely entirely on these three vector theorems.",
      "points": [
        "Green's Theorem in the Plane: Relates a closed line integral around curve C to a double integral over enclosed region R:",
        "oint_C (M dx + N dy) = integral integral_R (partial N / partial x - partial M / partial y) dx dy.",
        "Area calculation using Green's: Area = (1/2) * oint_C (x dy - y dx).",
        "Stokes' Theorem: Relates the line integral of vector field F along closed boundary C to the flux of curl(F) through any open surface S bounded by C:",
        "oint_C F . dr = integral integral_S (curl F) . dS.",
        "Conservative field: If curl(F) = 0 everywhere, oint_C F . dr = 0 for ANY closed path, and F = grad(phi).",
        "Gauss's Divergence Theorem: Relates the outward flux of vector field F through a closed surface S to the volume integral of div(F) over the enclosed volume V:",
        "oiint_S F . dS = integral integral integral_V (div F) dV."
      ],
      "formulas": [
        {
          "equation": "oint_C (M dx + N dy) = integral integral_R (partial N / partial x - partial M / partial y) dA",
          "meaning": "Green's Theorem in the plane.",
          "conditions": "C is a positively oriented, piecewise-smooth, simple closed curve."
        },
        {
          "equation": "oint_C F . dr = integral integral_S (grad x F) . dS",
          "meaning": "Stokes' Theorem.",
          "conditions": "S is an oriented open surface bounded by simple closed curve C."
        },
        {
          "equation": "oiint_S F . dS = integral integral integral_V (grad . F) dV",
          "meaning": "Gauss's Divergence Theorem.",
          "conditions": "S is a closed piecewise-smooth bounding surface enclosing volume V."
        }
      ],
      "example": {
        "question": "Use the Gauss Divergence Theorem to evaluate the outward flux of vector field F = 2*x*a_x + 3*y*a_y + z^2*a_z across the surface of the cylinder x^2 + y^2 <= 4 bounded by z = 0 and z = 3.",
        "given": [
          "Vector field F = 2*x*a_x + 3*y*a_y + z^2*a_z",
          "Cylinder: x^2 + y^2 <= 4 (radius R = 2)",
          "Height: 0 <= z <= 3"
        ],
        "steps": [
          "Compute divergence of F: div(F) = d(2x)/dx + d(3y)/dy + d(z^2)/dz",
          "div(F) = 2 + 3 + 2*z = 5 + 2*z",
          "Apply Divergence Theorem: oiint_S F.dS = integral integral integral_V (5 + 2*z) dV",
          "Using cylindrical coordinates: dV = r dr dtheta dz",
          "Limits: r from 0 to 2, theta from 0 to 2*pi, z from 0 to 3",
          "Area of base circle: pi * R^2 = pi * 2^2 = 4*pi",
          "Volume integral over z: integral_0^3 (5 + 2*z) dz = [5*z + z^2]_0^3 = (5*3 + 3^2) = 15 + 9 = 24",
          "Multiply by base area: Total Flux = 4*pi * 24 = 96*pi"
        ],
        "answer": "Total outward flux is 96*pi (approx 301.59)."
      },
      "gate": [
        "Stokes' theorem applies to an OPEN surface bounded by a closed curve C.",
        "Divergence theorem applies to a CLOSED surface enclosing a 3D volume V.",
        "If div(F) = 0 (solenoidal field), the net outward flux through ANY closed surface is strictly ZERO.",
        "If curl(F) = 0 (irrotational field), the line integral around ANY closed loop is strictly ZERO."
      ],
      "mistakes": [
        "Applying the Divergence theorem to an open surface (like a hemisphere without its base disc); you must cap the open surface to make it closed before using Divergence theorem.",
        "Sign errors in Green's theorem: it is (partial N / partial x - partial M / partial y), NOT M minus N."
      ],
      "diagram": "math",
      "diagramTitle": "Stokes' Loop-Surface and Gauss Closed-Volume Geometries",
      "diagramCaption": "Stokes' open surface S bounded by contour C versus Gauss closed surface S enclosing 3D volume V.",
      "studyGuide": [
        "Verify Green's theorem by evaluating both line and double integrals separately.",
        "Apply Stokes' theorem to calculate circulation of magnetic fields (Ampere's law).",
        "Use Divergence theorem to solve flux problems across cubes, spheres, and cylinders."
      ],
      "practiceQuestions": [
        {
          "question": "If a vector field F satisfies div(F) = 4 everywhere, what is the net outward flux of F across a sphere of radius R = 1 meter?",
          "type": "NAT",
          "answer": "16.76",
          "explanation": "oiint F.dS = integral (div F) dV = 4 * Volume of sphere = 4 * (4/3 * pi * 1^3) = 16*pi / 3 approx 16.755."
        },
        {
          "question": "A vector field F is conservative if and only if:",
          "type": "MCQ",
          "options": [
            "curl(F) = 0 everywhere in a simply connected domain",
            "div(F) = 0 everywhere",
            "grad(F) = 0 everywhere",
            "The flux of F through any closed surface is non-zero"
          ],
          "answer": "curl(F) = 0 everywhere in a simply connected domain",
          "explanation": "A conservative field has path-independent line integrals, which by Stokes' theorem is equivalent to curl(F) = 0."
        }
      ],
      "quickRevision": "Green's: oint (M dx + N dy) = double int (dN/dx - dM/dy) dA. Stokes': oint F.dr = double int (curl F).dS (open surface). Gauss: oiint F.dS = triple int (div F) dV (closed surface). Solenoidal: div F = 0 (0 closed flux). Irrotational: curl F = 0 (conservative).",
      "relatedTopics": [
        "Vector Calculus",
        "Multiple Integrals: Double, Triple, and Change of Variables (Jacobian)",
        "Gauss Law and Boundary Conditions"
      ]
    }
  },
  {
    "title": "Cauchy-Riemann Equations, Analytic Functions, and Harmonic Conjugates",
    "summary": "Complex differentiation, Cauchy-Riemann conditions u_x = v_y and u_y = -v_x, analytic/holomorphic functions, Laplace equation, and Milne-Thomson method.",
    "orderIndex": 17,
    "lesson": {
      "intro": "A complex function f(z) = u(x, y) + j*v(x, y) is Analytic (holomorphic) at a point if its complex derivative exists everywhere in a neighborhood, which holds if and only if the real and imaginary parts satisfy the Cauchy-Riemann (C-R) Equations.",
      "simple": "In real calculus, a derivative only approaches from left and right. In complex calculus, a point can be approached from any of 360 degrees in the 2D complex plane. For the derivative to be the same from every direction, the real and imaginary parts must be locked together by the Cauchy-Riemann equations.",
      "why": "Analytic functions govern 2D electrostatic potentials, ideal fluid flow streamlines, and form the prerequisite for complex contour integration in GATE.",
      "points": [
        "Cauchy-Riemann (C-R) Equations in Cartesian form:",
        "1. u_x = v_y   (partial u / partial x = partial v / partial y)",
        "2. u_y = -v_x   (partial u / partial y = - partial v / partial x)",
        "C-R Equations in Polar form (z = r * exp(j*theta)):",
        "1. u_r = (1 / r) * v_theta",
        "2. v_r = -(1 / r) * u_theta",
        "Complex Derivative: f'(z) = u_x + j * v_x = v_y - j * u_y.",
        "Harmonic Functions: Both real part u and imaginary part v of an analytic function satisfy Laplace's equation: u_xx + u_yy = 0 and v_xx + v_yy = 0.",
        "Harmonic Conjugate: v(x, y) is called the harmonic conjugate of u(x, y).",
        "Orthogonal Trajectories: Curves of constant u(x, y) = c1 and constant v(x, y) = c2 are everywhere mutually orthogonal (grad(u) . grad(v) = 0).",
        "Milne-Thomson Method: Directly constructs f(z) from u(x, y) without computing v: f'(z) = u_x(z, 0) - j * u_y(z, 0), then integrate with respect to z."
      ],
      "formulas": [
        {
          "equation": "partial u / partial x = partial v / partial y,   partial u / partial y = - partial v / partial x",
          "meaning": "Cauchy-Riemann equations in Cartesian coordinates.",
          "conditions": "Necessary condition for f(z) = u + jv to be differentiable."
        },
        {
          "equation": "u_{xx} + u_{yy} = 0,   v_{xx} + v_{yy} = 0",
          "meaning": "Laplace equation (harmonic property).",
          "conditions": "Real and imaginary parts of an analytic function."
        },
        {
          "equation": "f'(z) = u_x(z, 0) - j * u_y(z, 0)",
          "meaning": "Milne-Thomson method for constructing analytic function f(z).",
          "conditions": "Given real part u(x, y)."
        }
      ],
      "example": {
        "question": "Find the analytic function f(z) = u + j*v whose real part is u(x, y) = x^2 - y^2 + 2*x, with f(0) = 0, using the Milne-Thomson method.",
        "given": [
          "u(x, y) = x^2 - y^2 + 2*x",
          "f(0) = 0"
        ],
        "steps": [
          "Compute partial derivatives of u:",
          "u_x = 2*x + 2",
          "u_y = -2*y",
          "Apply Milne-Thomson: Replace x with z, and y with 0:",
          "u_x(z, 0) = 2*z + 2",
          "u_y(z, 0) = -2*(0) = 0",
          "Form f'(z): f'(z) = u_x(z, 0) - j * u_y(z, 0) = (2*z + 2) - j*(0) = 2*z + 2",
          "Integrate with respect to z:",
          "f(z) = integral (2*z + 2) dz = z^2 + 2*z + C",
          "Apply initial condition f(0) = 0: 0^2 + 2*(0) + C = 0 => C = 0",
          "Check: f(z) = (x + jy)^2 + 2*(x + jy) = x^2 - y^2 + 2*j*x*y + 2*x + 2*j*y = (x^2 - y^2 + 2*x) + j*(2*x*y + 2*y) (matches u exactly!)."
        ],
        "answer": "f(z) = z^2 + 2*z."
      },
      "gate": [
        "C-R equations are necessary for analyticity; continuity of partial derivatives is required for sufficiency.",
        "If f(z) is analytic and |f(z)| is constant, then f(z) MUST be a constant function!",
        "If both f(z) and f*(z) are analytic, f(z) must be constant.",
        "Milne-Thomson shortcut: saves 80% time compared to integrating exact differential dv = v_x dx + v_y dy."
      ],
      "mistakes": [
        "Sign error in second C-R equation: u_y = -v_x, NOT +v_x.",
        "Applying Milne-Thomson with +j instead of -j: f'(z) = u_x(z, 0) - j*u_y(z, 0)."
      ],
      "diagram": "math",
      "diagramTitle": "Orthogonal Trajectories of Analytic Function (u and v)",
      "diagramCaption": "Curves of constant u(x, y) (equipotentials) intersecting curves of constant v(x, y) (streamlines) at 90 degrees.",
      "studyGuide": [
        "Verify whether given functions satisfy Laplace's equation.",
        "Find harmonic conjugates v(x, y) using exact differential methods.",
        "Master the Milne-Thomson technique for both given u(x, y) and given v(x, y)."
      ],
      "practiceQuestions": [
        {
          "question": "Which of the following functions can serve as the real part of an analytic function f(z) = u + jv?",
          "type": "MCQ",
          "options": [
            "u(x, y) = x^2 - y^2",
            "u(x, y) = x^2 + y^2",
            "u(x, y) = x^3 + y^3",
            "u(x, y) = x^2 * y"
          ],
          "answer": "u(x, y) = x^2 - y^2",
          "explanation": "The real part must satisfy Laplace's equation u_xx + u_yy = 0. For u = x^2 - y^2: u_xx = 2, u_yy = -2 => 2 + (-2) = 0 (harmonic)."
        },
        {
          "question": "If f(z) = u + jv is an analytic function and u(x, y) = 3x^2 - 3y^2, what is the value of (partial^2 v / partial x^2 + partial^2 v / partial y^2)?",
          "type": "NAT",
          "answer": "0",
          "explanation": "Since f(z) is analytic, its imaginary part v is harmonic and must satisfy Laplace's equation: v_xx + v_yy = 0."
        }
      ],
      "quickRevision": "C-R equations: u_x = v_y, u_y = -v_x. Polar: u_r = (1/r)*v_theta, v_r = -(1/r)*u_theta. Real and imaginary parts are harmonic (u_xx + u_yy = 0). Milne-Thomson: f'(z) = u_x(z, 0) - j*u_y(z, 0). Curves u=c1 and v=c2 are orthogonal.",
      "relatedTopics": [
        "Complex Variables",
        "Cauchy Integral Formula and Residue Theorem for Contour Integration",
        "Electrostatic Fields and Potential"
      ]
    }
  },
  {
    "title": "Cauchy Integral Formula and Residue Theorem for Contour Integration",
    "summary": "Cauchy-Goursat theorem, Cauchy integral formula, classification of singularities (poles), residue calculation, and the Residue Theorem.",
    "orderIndex": 18,
    "lesson": {
      "intro": "The Residue Theorem is the crowning achievement of complex analysis, allowing difficult contour integrals\u2014and even improper real integrals from -infinity to +infinity\u2014to be evaluated simply by summing the algebraic residues of enclosed singularities.",
      "simple": "Instead of integrating along a curved path in the complex plane, Cauchy's Residue Theorem says the entire integral equals 2*pi*j times the sum of little numbers called 'residues' sitting at the isolated poles trapped inside your loop.",
      "why": "Evaluating contour integrals, inverse Laplace transforms (Bromwich contour), and inverse Z-transforms in GATE relies on residue calculations.",
      "points": [
        "Cauchy-Goursat Theorem: If f(z) is analytic everywhere inside and on a closed contour C, then oint_C f(z) dz = 0.",
        "Cauchy Integral Formula: If f(z) is analytic inside C, and z0 is any point interior to C:",
        "oint_C [ f(z) / (z - z0) ] dz = 2 * pi * j * f(z0).",
        "Higher Derivatives Formula: oint_C [ f(z) / (z - z0)^(n + 1) ] dz = (2 * pi * j / n!) * f^(n)(z0).",
        "Singularities: Points where f(z) fails to be analytic. A pole of order m satisfies lim(z->z0) (z - z0)^m * f(z) = finite != 0.",
        "Residue at Simple Pole (order 1): Res(z0) = lim(z->z0) (z - z0) * f(z).",
        "Residue at Pole of order m: Res(z0) = (1 / (m - 1)!) * lim(z->z0) d^(m-1)/dz^(m-1) [ (z - z0)^m * f(z) ].",
        "Cauchy's Residue Theorem: oint_C f(z) dz = 2 * pi * j * sum [ Residues at poles ENCLOSED by C ]."
      ],
      "formulas": [
        {
          "equation": "oint_C f(z) dz = 2 * pi * j * sum_{k=1}^N Res(f, z_k)",
          "meaning": "Cauchy's Residue Theorem for counterclockwise closed contour C.",
          "conditions": "f(z) analytic except at isolated singularities zk inside C."
        },
        {
          "equation": "Res(z_0) = lim_{z -> z_0} (z - z_0) * f(z)",
          "meaning": "Residue at a simple pole (order 1).",
          "conditions": "Simple pole at z = z0."
        },
        {
          "equation": "oint_C [ f(z) / (z - z_0)^{n+1} ] dz = (2 * pi * j / n!) * f^{(n)}(z_0)",
          "meaning": "Generalized Cauchy Integral Formula for n-th derivative.",
          "conditions": "z0 is interior to contour C, f(z) is analytic."
        }
      ],
      "example": {
        "question": "Evaluate the contour integral I = oint_C [ (z^2 + 1) / (z^2 - 4) ] dz along the circle C: |z - 1| = 2 oriented counterclockwise.",
        "given": [
          "Integrand: f(z) = (z^2 + 1) / ((z - 2)(z + 2))",
          "Contour C: |z - 1| = 2 (circle centered at z = 1 with radius R = 2)"
        ],
        "steps": [
          "Find poles: z^2 - 4 = 0 => z1 = +2 and z2 = -2 (both simple poles)",
          "Check which poles lie INSIDE contour |z - 1| = 2:",
          "- For z1 = +2: |2 - 1| = 1 <= 2 (LIES INSIDE C).",
          "- For z2 = -2: |-2 - 1| = |-3| = 3 > 2 (LIES OUTSIDE C).",
          "Only the pole at z = 2 is enclosed by contour C!",
          "Calculate residue at z = 2:",
          "Res(2) = lim(z->2) (z - 2) * [ (z^2 + 1) / ((z - 2)(z + 2)) ] = lim(z->2) (z^2 + 1) / (z + 2)",
          "Res(2) = (2^2 + 1) / (2 + 2) = (4 + 1) / 4 = 5 / 4 = 1.25",
          "Apply Residue Theorem: I = 2 * pi * j * Res(2) = 2 * pi * j * (5 / 4) = (5 * pi * j) / 2"
        ],
        "answer": "The value of the contour integral is j * 2.5 * pi (or 2.5 * pi * j)."
      },
      "gate": [
        "ALWAYS check whether each pole lies INSIDE or OUTSIDE the specified contour C! Poles lying outside contribute ZERO to the integral.",
        "If ALL poles lie outside the contour C, the integral is strictly ZERO (Cauchy-Goursat theorem).",
        "If the contour orientation is clockwise, multiply the final result by -1."
      ],
      "mistakes": [
        "Summing residues of poles that lie outside the contour boundary.",
        "Using the simple pole formula on a multiple-order pole (e.g. pole of order 2 requires 1/1! * d/dz [(z-z0)^2 * f(z)])."
      ],
      "diagram": "math",
      "diagramTitle": "Contour Integration and Enclosed Residue Poles",
      "diagramCaption": "Closed contour C showing enclosed pole z1 contributing to integral and external pole z2 contributing zero.",
      "studyGuide": [
        "Identify simple vs multiple poles from factored denominators.",
        "Compute residues for trigonometric and rational complex functions.",
        "Apply contour integration to evaluate real definite integrals over [0, 2*pi] and [-inf, +inf]."
      ],
      "practiceQuestions": [
        {
          "question": "Evaluate oint_C [ exp(z) / (z - 3) ] dz where C is the unit circle |z| = 1 oriented counterclockwise.",
          "type": "NAT",
          "answer": "0",
          "explanation": "The only pole is at z = 3. Since |3| = 3 > 1, the pole lies strictly outside the unit circle. By Cauchy-Goursat theorem, the integral is 0."
        },
        {
          "question": "The residue of f(z) = 1 / (z^2 + 9) at the pole z = 3*j is:",
          "type": "MCQ",
          "options": [
            "-j / 6",
            "+j / 6",
            "1 / 6",
            "-1 / 6"
          ],
          "answer": "-j / 6",
          "explanation": "f(z) = 1 / [(z - 3j)(z + 3j)]. Res(3j) = lim(z->3j) (z - 3j)*f(z) = 1 / (3j + 3j) = 1 / (6j) = -j / 6."
        }
      ],
      "quickRevision": "Cauchy-Goursat: oint f(z) dz = 0 if no poles inside. Cauchy Integral: oint f(z)/(z-z0) dz = 2*pi*j*f(z0). Residue theorem: oint f(z) dz = 2*pi*j * sum(Residues of poles INSIDE C). Res(simple) = lim (z-z0)*f(z). Clockwise contour multiplies by -1.",
      "relatedTopics": [
        "Cauchy-Riemann Equations, Analytic Functions, and Harmonic Conjugates",
        "Complex Variables",
        "Laplace Transform"
      ]
    }
  },
  {
    "title": "Higher-Order Linear Ordinary Differential Equations with Constant Coefficients",
    "summary": "Homogeneous solutions via characteristic auxiliary roots, non-homogeneous Complementary Function (CF) and Particular Integral (PI) shortcut operators.",
    "orderIndex": 19,
    "lesson": {
      "intro": "Linear Ordinary Differential Equations (ODEs) with constant coefficients govern dynamic systems in circuits (RLC transients), control, and mechanical vibrations, solved by superimposing the Complementary Function (CF) and the Particular Integral (PI): y(x) = y_c(x) + y_p(x).",
      "simple": "The Complementary Function describes the natural ringing (free response) of the circuit without any power supply. The Particular Integral describes the forced response driven by the external input voltage. Adding them together gives the complete total behavior.",
      "why": "Solving 2nd and 3rd order ODEs and finding Particular Integrals for exp(ax), sin(ax), and polynomials appears in every GATE examination.",
      "points": [
        "General ODE: a_n * (d^n y / dx^n) + ... + a1 * (dy / dx) + a0 * y = X(x). In operator form: f(D) * y = X(x), where D = d/dx.",
        "Auxiliary Equation: f(m) = a_n * m^n + ... + a1 * m + a0 = 0.",
        "Complementary Function (CF) rules for roots of f(m) = 0:",
        "1. Real and distinct roots m1, m2: y_c = C1*exp(m1*x) + C2*exp(m2*x).",
        "2. Real and repeated roots m1 = m2 = m: y_c = (C1 + C2*x)*exp(m*x).",
        "3. Complex conjugate roots alpha +/- j*beta: y_c = exp(alpha*x) * [ C1*cos(beta*x) + C2*sin(beta*x) ].",
        "Particular Integral (PI) shortcuts y_p = (1 / f(D)) * X(x):",
        "- Rule 1: X(x) = exp(a*x) => y_p = exp(a*x) / f(a), provided f(a) != 0. If f(a) = 0: y_p = x * exp(a*x) / f'(a).",
        "- Rule 2: X(x) = sin(a*x) or cos(a*x) => Replace D^2 with -a^2 in f(D), provided f(-a^2) != 0.",
        "- Rule 3: X(x) = x^m => Expand [f(D)]^-1 in ascending powers of D using binomial expansion."
      ],
      "formulas": [
        {
          "equation": "y(x) = y_{CF}(x) + y_{PI}(x)",
          "meaning": "Total complete solution to non-homogeneous linear ODE.",
          "conditions": "Linear ODE with constant coefficients."
        },
        {
          "equation": "y_p = [ 1 / f(D) ] * exp(a*x) = exp(a*x) / f(a)",
          "meaning": "Particular integral shortcut for exponential forcing function.",
          "conditions": "f(a) != 0."
        },
        {
          "equation": "y_p = [ 1 / f(D^2) ] * sin(a*x) = sin(a*x) / f(-a^2)",
          "meaning": "Particular integral shortcut for sinusoidal forcing function.",
          "conditions": "Replace D^2 with -a^2, valid for f(-a^2) != 0."
        }
      ],
      "example": {
        "question": "Solve the second-order differential equation (d^2 y / dx^2) - 4*(dy / dx) + 4*y = exp(2*x).",
        "given": [
          "ODE: (D^2 - 4*D + 4)*y = exp(2*x)"
        ],
        "steps": [
          "Auxiliary equation: m^2 - 4*m + 4 = 0 => (m - 2)^2 = 0",
          "Roots: m1 = 2, m2 = 2 (real and repeated roots)",
          "Complementary Function: y_c(x) = (C1 + C2*x) * exp(2*x)",
          "Particular Integral: y_p = [ 1 / (D - 2)^2 ] * exp(2*x)",
          "Since f(2) = (2 - 2)^2 = 0 (root has multiplicity 2):",
          "Standard formula for (D - a)^k: [ 1 / (D - a)^k ] * exp(a*x) = (x^k / k!) * exp(a*x)",
          "Here a = 2 and k = 2:",
          "y_p = (x^2 / 2!) * exp(2*x) = (x^2 / 2) * exp(2*x)",
          "Total solution: y(x) = y_c + y_p = (C1 + C2*x)*exp(2*x) + (x^2 / 2)*exp(2*x)"
        ],
        "answer": "y(x) = (C1 + C2*x + x^2 / 2) * exp(2*x)."
      },
      "gate": [
        "For sin(a*x) and cos(a*x), replace D^2 with -(a^2), NOT (-a)^2! For example, if a = 3, replace D^2 with -9, NOT +9.",
        "If f(-a^2) = 0 (resonance), multiply numerator by x and differentiate denominator: y_p = x * [ 1 / f'(D) ] * sin(ax).",
        "Initial conditions must be applied to the TOTAL solution y = y_c + y_p, NEVER to y_c alone!"
      ],
      "mistakes": [
        "Substituting D = a for sinusoidal inputs instead of D^2 = -a^2.",
        "Evaluating constants C1 and C2 before finding the particular integral."
      ],
      "diagram": "math",
      "diagramTitle": "Total ODE Solution Composition",
      "diagramCaption": "Superposition of transient complementary function (natural response) and steady-state particular integral (forced response).",
      "studyGuide": [
        "Memorize CF forms for distinct, repeated, and complex roots.",
        "Master PI shortcuts for exp(ax), sin(ax)/cos(ax), and polynomials x^m.",
        "Apply variation of parameters for non-standard forcing functions (like tan(x) or sec(x))."
      ],
      "practiceQuestions": [
        {
          "question": "What is the Particular Integral (PI) of the differential equation (D^2 + 9)*y = cos(2*x)?",
          "type": "MCQ",
          "options": [
            "(1 / 5) * cos(2*x)",
            "-(1 / 5) * cos(2*x)",
            "(1 / 13) * cos(2*x)",
            "(x / 6) * sin(2*x)"
          ],
          "answer": "(1 / 5) * cos(2*x)",
          "explanation": "Replace D^2 with -2^2 = -4. PI = cos(2x) / (-4 + 9) = cos(2x) / 5 = (1/5)*cos(2x)."
        },
        {
          "question": "For the ODE (D^2 + 4)*y = 0 with y(0) = 0 and y'(0) = 6, the value of y(pi/4) is:",
          "type": "NAT",
          "answer": "3",
          "explanation": "Roots: m^2 + 4 = 0 => m = +/- 2j. General solution: y(x) = C1*cos(2x) + C2*sin(2x). y(0) = C1 = 0. y'(x) = 2*C2*cos(2x) => y'(0) = 2*C2 = 6 => C2 = 3. So y(x) = 3*sin(2x). At x = pi/4: y(pi/4) = 3*sin(pi/2) = 3*1 = 3."
        }
      ],
      "quickRevision": "y(x) = y_c + y_p. Auxiliary eq f(m) = 0 gives roots for CF. Distinct: C1*exp(m1*x) + C2*exp(m2*x). Repeated: (C1 + C2*x)*exp(mx). Complex: exp(alpha*x)*(C1*cos + C2*sin). PI: exp(ax)/f(a); sin(ax) replace D^2 with -a^2. Resonance: multiply by x and differentiate denominator.",
      "relatedTopics": [
        "Differential Equations",
        "Partial Differential Equations: Wave, Heat, and Laplace via Separation of Variables",
        "First-Order Transient Analysis"
      ]
    }
  },
  {
    "title": "Partial Differential Equations: Wave, Heat, and Laplace via Separation of Variables",
    "summary": "1D Wave equation (hyperbolic), 1D Heat equation (parabolic), 2D Laplace equation (elliptic), boundary conditions, and Fourier series solutions.",
    "orderIndex": 20,
    "lesson": {
      "intro": "Partial Differential Equations (PDEs) describe physical phenomena involving functions of multiple independent variables (space and time), classified into Wave (hyperbolic), Heat (parabolic), and Laplace (elliptic) equations, solved using the Separation of Variables method.",
      "simple": "When you pluck a guitar string, its displacement depends on both where you look along the string (x) and what time it is (t). Separation of variables splits the 2D problem into two separate, simple single-variable ODEs: one for space X(x) and one for time T(t).",
      "why": "Electromagnetic wave propagation, thermal dissipation on semiconductor chips, and electrostatic potential distributions are modeled directly by these three canonical PDEs.",
      "points": [
        "Three Fundamental Equations:",
        "1. 1D Wave Equation (Hyperbolic): partial^2 u / partial t^2 = c^2 * (partial^2 u / partial x^2). Describes vibrating strings and TEM waves.",
        "2. 1D Heat / Diffusion Equation (Parabolic): partial u / partial t = alpha^2 * (partial^2 u / partial x^2). Describes thermal conduction and carrier diffusion.",
        "3. 2D Laplace Equation (Elliptic): partial^2 u / partial x^2 + partial^2 u / partial y^2 = 0. Describes steady-state electrostatic potential.",
        "Separation of Variables Technique: Assume product solution u(x, t) = X(x) * T(t).",
        "Divide by X*T to separate variables: X''(x) / X(x) = (1 / c^2) * T''(t) / T(t) = -lambda (separation constant).",
        "Boundary Conditions determine eigenvalues lambda_n and spatial eigenfunctions X_n(x) = sin(n*pi*x / L).",
        "Initial Conditions determine Fourier coefficients through orthogonality."
      ],
      "formulas": [
        {
          "equation": "partial^2 u / partial t^2 = c^2 * (partial^2 u / partial x^2)",
          "meaning": "One-dimensional wave equation (c = propagation wave speed).",
          "conditions": "Hyperbolic PDE; solution u(x, t) = sum [ An*cos(n*pi*c*t/L) + Bn*sin(n*pi*c*t/L) ] * sin(n*pi*x/L)."
        },
        {
          "equation": "partial u / partial t = alpha^2 * (partial^2 u / partial x^2)",
          "meaning": "One-dimensional heat conduction equation (alpha^2 = thermal diffusivity).",
          "conditions": "Parabolic PDE; exponential decay in time exp(-alpha^2 * (n*pi/L)^2 * t)."
        },
        {
          "equation": "partial^2 u / partial x^2 + partial^2 u / partial y^2 = 0",
          "meaning": "Two-dimensional Laplace equation.",
          "conditions": "Elliptic PDE; harmonic potential in source-free region."
        }
      ],
      "example": {
        "question": "A string of length L = pi with fixed ends (u(0, t) = u(pi, t) = 0) satisfies the wave equation u_tt = 4 * u_xx. If the initial displacement is u(x, 0) = 3*sin(x) - 2*sin(3*x) and initial velocity is zero (u_t(x, 0) = 0), find the displacement u(x, t).",
        "given": [
          "Wave equation: u_tt = c^2 * u_xx with c^2 = 4 => c = 2",
          "Length L = pi",
          "u(0, t) = u(pi, t) = 0",
          "u(x, 0) = 3*sin(x) - 2*sin(3*x), and u_t(x, 0) = 0"
        ],
        "steps": [
          "General separation solution for zero initial velocity:",
          "u(x, t) = sum_{n=1}^infinity A_n * cos(n * c * pi * t / L) * sin(n * pi * x / L)",
          "Substitute L = pi and c = 2:",
          "u(x, t) = sum_{n=1}^infinity A_n * cos(2 * n * t) * sin(n * x)",
          "Match with initial displacement at t = 0 (where cos(0) = 1):",
          "u(x, 0) = sum_{n=1}^infinity A_n * sin(n * x) = 3 * sin(x) - 2 * sin(3 * x)",
          "Equate Fourier coefficients directly:",
          "For n = 1: A1 = 3",
          "For n = 3: A3 = -2",
          "All other An = 0",
          "Substitute An back into general solution:",
          "u(x, t) = 3 * cos(2 * 1 * t) * sin(x) - 2 * cos(2 * 3 * t) * sin(3 * x)",
          "u(x, t) = 3 * cos(2*t) * sin(x) - 2 * cos(6*t) * sin(3*x)"
        ],
        "answer": "u(x, t) = 3*cos(2t)*sin(x) - 2*cos(6t)*sin(3x)."
      },
      "gate": [
        "PDE Classification via discriminant B^2 - 4*A*C for A*u_xx + B*u_xy + C*u_yy + ... = 0:",
        "- B^2 - 4*A*C > 0: Hyperbolic (Wave equation).",
        "- B^2 - 4*A*C = 0: Parabolic (Heat equation).",
        "- B^2 - 4*A*C < 0: Elliptic (Laplace equation).",
        "Heat equation solutions decay exponentially with time exp(-t / tau); wave equation solutions oscillate sinusoidally without decay."
      ],
      "mistakes": [
        "Classifying u_xx + u_yy = 0 as parabolic; A = 1, B = 0, C = 1 => 0 - 4*(1)(1) = -4 < 0, so it is ELLIPTIC.",
        "Using sine series when boundary conditions specify derivatives (Neumann conditions require cosine series)."
      ],
      "diagram": "math",
      "diagramTitle": "PDE Classification and Physical Domains",
      "diagramCaption": "Comparison of Wave (vibrating string), Heat (temperature diffusion decay), and Laplace (potential mesh).",
      "studyGuide": [
        "Classify second-order PDEs as hyperbolic, parabolic, or elliptic.",
        "Set up separation of variables product solutions u = X(x)*Y(y) or X(x)*T(t).",
        "Compute Fourier coefficients to satisfy non-trivial initial conditions."
      ],
      "practiceQuestions": [
        {
          "question": "The partial differential equation 2*(partial^2 u / partial x^2) + 4*(partial^2 u / partial x partial y) + 2*(partial^2 u / partial y^2) = 0 is classified as:",
          "type": "MCQ",
          "options": [
            "Parabolic",
            "Hyperbolic",
            "Elliptic",
            "Circular"
          ],
          "answer": "Parabolic",
          "explanation": "A = 2, B = 4, C = 2. Discriminant = B^2 - 4*A*C = 4^2 - 4*(2)*(2) = 16 - 16 = 0. Therefore, the PDE is Parabolic."
        },
        {
          "question": "In the separation of variables solution to the 1D heat equation u_t = alpha^2 * u_xx with fixed zero boundary conditions, the time-dependent term T(t) exhibits:",
          "type": "MCQ",
          "options": [
            "Exponential decay",
            "Pure sinusoidal oscillation",
            "Linearly growing ramp",
            "Constant value independent of time"
          ],
          "answer": "Exponential decay",
          "explanation": "T'(t) / (alpha^2 * T(t)) = -lambda => T(t) is proportional to exp(-alpha^2 * lambda * t), representing thermal energy diffusing and decaying to equilibrium."
        }
      ],
      "quickRevision": "PDE Classification: B^2 - 4AC > 0 (Hyperbolic/Wave), = 0 (Parabolic/Heat), < 0 (Elliptic/Laplace). Wave: u_tt = c^2*u_xx (oscillates). Heat: u_t = alpha^2*u_xx (decays as exp(-t)). Laplace: u_xx + u_yy = 0. Solve via separation u(x, t) = X(x)*T(t).",
      "relatedTopics": [
        "Higher-Order Linear Ordinary Differential Equations with Constant Coefficients",
        "Differential Equations",
        "Fourier Series"
      ]
    }
  },
  {
    "title": "Bayes' Theorem, Total Probability, and Conditional Independence",
    "summary": "Law of Total Probability, Bayes' rule for posterior probability update, conditional probability P(A|B) = P(A cap B)/P(B), and false positive paradox.",
    "orderIndex": 21,
    "lesson": {
      "intro": "Bayes' Theorem provides the mathematical framework for updating the probability of a hypothesis (prior probability) in light of new observed evidence (posterior probability), combining the Law of Total Probability with conditional probability.",
      "simple": "If a medical test for a rare disease is 99% accurate and you test positive, what are the odds you are actually sick? Counter-intuitively, if the disease is extremely rare (say 1 in 10,000), you are still far more likely to be healthy! Bayes' theorem calculates the exact true probability by balancing the test accuracy against the rarity of the disease.",
      "why": "Bayes' rule governs digital communications MAP receivers, radar false alarm rate calculations, and machine learning classification.",
      "points": [
        "Conditional Probability: P(A | B) = P(A cap B) / P(B), provided P(B) > 0.",
        "Multiplication Rule: P(A cap B) = P(A | B) * P(B) = P(B | A) * P(A).",
        "Independence: Events A and B are independent if and only if P(A cap B) = P(A) * P(B) (which implies P(A | B) = P(A)).",
        "Law of Total Probability: If events B1, B2, ..., Bn form a mutually exclusive and exhaustive partition of sample space S: P(A) = sum_{i=1}^n P(A | B_i) * P(B_i).",
        "Bayes' Theorem: P(B_k | A) = [ P(A | B_k) * P(B_k) ] / [ sum_{i=1}^n P(A | B_i) * P(B_i) ].",
        "Terms in Bayes' rule: P(B_k) is Prior probability; P(A | B_k) is Likelihood; P(A) is Marginal probability; P(B_k | A) is Posterior probability."
      ],
      "formulas": [
        {
          "equation": "P(B_k | A) = [ P(A | B_k) * P(B_k) ] / [ sum_{i=1}^n P(A | B_i) * P(B_i) ]",
          "meaning": "Bayes' Theorem for mutually exclusive partition B1, ..., Bn.",
          "conditions": "P(A) > 0 and sum P(B_i) = 1."
        },
        {
          "equation": "P(A) = sum_{i=1}^n P(A | B_i) * P(B_i)",
          "meaning": "Law of Total Probability.",
          "conditions": "Bi are pairwise disjoint with union equal to sample space."
        },
        {
          "equation": "P(A cap B) = P(A) * P(B)",
          "meaning": "Condition for statistical independence of events A and B.",
          "conditions": "Two independent events."
        }
      ],
      "example": {
        "question": "A binary symmetric channel transmits bit 0 with probability 0.6 and bit 1 with probability 0.4. Due to noise, the probability of bit flip (error) is P(r=1 | s=0) = P(r=0 | s=1) = 0.1. If the receiver receives bit 1, calculate the probability that bit 1 was actually transmitted.",
        "given": [
          "Prior: P(s=0) = 0.6, P(s=1) = 0.4",
          "Channel errors: P(r=1 | s=0) = 0.1, P(r=1 | s=1) = 1 - 0.1 = 0.9",
          "Received evidence: r = 1"
        ],
        "steps": [
          "Calculate total probability of receiving 1 (Law of Total Probability):",
          "P(r=1) = P(r=1 | s=0)*P(s=0) + P(r=1 | s=1)*P(s=1)",
          "P(r=1) = (0.1 * 0.6) + (0.9 * 0.4) = 0.06 + 0.36 = 0.42",
          "Apply Bayes' Theorem to find posterior probability P(s=1 | r=1):",
          "P(s=1 | r=1) = [ P(r=1 | s=1) * P(s=1) ] / P(r=1)",
          "P(s=1 | r=1) = 0.36 / 0.42 = 36 / 42 = 6 / 7 approx 0.8571 = 85.71%"
        ],
        "answer": "The probability that bit 1 was transmitted is 6/7 approx 0.857 (85.7%)."
      },
      "gate": [
        "Do not confuse P(A | B) with P(B | A)! In general, P(A | B) != P(B | A).",
        "Mutually exclusive events with non-zero probability can NEVER be independent (if A happens, B cannot happen, so P(B|A) = 0 != P(B)).",
        "Posterior probability P(hypothesis | evidence) balances prior belief against likelihood of evidence."
      ],
      "mistakes": [
        "Assuming independence when events are merely mutually exclusive.",
        "Forgetting to compute the marginal denominator P(evidence) using the Law of Total Probability."
      ],
      "diagram": "math",
      "diagramTitle": "Bayesian Probability Tree and Total Probability Partition",
      "diagramCaption": "Tree diagram branching priors P(Bi) into conditional branches P(A|Bi) leading to Bayes calculation.",
      "studyGuide": [
        "Draw tree diagrams to systematically organize prior and conditional probabilities.",
        "Solve classic diagnostic test false-positive problems.",
        "Apply Bayes' rule to binary symmetric and asymmetric digital communication channels."
      ],
      "practiceQuestions": [
        {
          "question": "If P(A) = 0.4, P(B) = 0.5, and P(A cap B) = 0.2, are events A and B independent?",
          "type": "MCQ",
          "options": [
            "Yes, because P(A)*P(B) = P(A cap B)",
            "No, because P(A)*P(B) != P(A cap B)",
            "Cannot be determined without P(A cup B)",
            "Yes, because P(A) + P(B) < 1"
          ],
          "answer": "Yes, because P(A)*P(B) = P(A cap B)",
          "explanation": "P(A) * P(B) = 0.4 * 0.5 = 0.20, which exactly equals P(A cap B) = 0.20. Therefore, events A and B are statistically independent."
        },
        {
          "question": "Box 1 has 3 red and 2 white balls. Box 2 has 2 red and 3 white balls. A box is chosen at random (equal probability) and a ball is drawn. If the drawn ball is red, the probability that it came from Box 1 is:",
          "type": "NAT",
          "answer": "0.6",
          "explanation": "P(Box1) = P(Box2) = 0.5. P(Red|Box1) = 3/5 = 0.6. P(Red|Box2) = 2/5 = 0.4. Total P(Red) = 0.5*0.6 + 0.5*0.4 = 0.5. By Bayes: P(Box1|Red) = (0.5 * 0.6) / 0.5 = 0.6."
        }
      ],
      "quickRevision": "Conditional: P(A|B) = P(A cap B)/P(B). Total Probability: P(A) = sum P(A|Bi)*P(Bi). Bayes' rule: P(Bk|A) = [P(A|Bk)*P(Bk)] / P(A). Independent: P(A cap B) = P(A)*P(B). Mutually exclusive != Independent.",
      "relatedTopics": [
        "Probability and Statistics",
        "Random Variables and Distributions",
        "Maximum Likelihood (ML) and Maximum A Posteriori (MAP) Detection"
      ]
    }
  },
  {
    "title": "Joint Probability Distributions, Covariance, and Correlation Coefficient",
    "summary": "Joint PDF/PMF, marginal distributions, conditional expectation, Covariance Cov(X, Y) = E[XY] - E[X]E[Y], Pearson correlation rho, and bivariate Gaussian.",
    "orderIndex": 22,
    "lesson": {
      "intro": "When pairs of random variables (X, Y) are observed simultaneously, their joint probability distribution describes their co-dependence, quantified by Covariance and the Pearson Correlation Coefficient rho.",
      "simple": "Covariance measures whether two variables climb together (positive covariance, like height and shoe size), move opposite (negative covariance, like speed and travel time), or have no linear relationship (zero covariance). The correlation coefficient rho scales this between -1 and +1.",
      "why": "Signal detection in noise, MIMO channel capacity, estimation theory (MMSE, Wiener filters), and Kalman filtering rely directly on covariance matrices.",
      "points": [
        "Joint Probability Density Function f_XY(x, y): Satisfies f_XY(x, y) >= 0 and integral integral f_XY(x, y) dx dy = 1.",
        "Marginal PDFs: Obtained by integrating out the unwanted variable: f_X(x) = integral_{-inf}^inf f_XY(x, y) dy.",
        "Statistical Independence: X and Y are independent if and only if f_XY(x, y) = f_X(x) * f_Y(y) for all (x, y).",
        "Expected value of product: E[X * Y] = integral integral x * y * f_XY(x, y) dx dy.",
        "If X and Y are independent: E[X * Y] = E[X] * E[Y].",
        "Covariance: Cov(X, Y) = sigma_XY = E[(X - mu_X)*(Y - mu_Y)] = E[X * Y] - E[X] * E[Y].",
        "Pearson Correlation Coefficient: rho_XY = Cov(X, Y) / (sigma_X * sigma_Y), where -1 <= rho_XY <= +1.",
        "Uncorrelated vs Independent: If X and Y are independent, they are ALWAYS uncorrelated (rho = 0). But rho = 0 does NOT generally imply independence (except for Bivariate Gaussian variables!)."
      ],
      "formulas": [
        {
          "equation": "Cov(X, Y) = E[X * Y] - E[X] * E[Y]",
          "meaning": "Covariance between random variables X and Y.",
          "conditions": "Well-defined finite second moments."
        },
        {
          "equation": "rho_{XY} = Cov(X, Y) / (sigma_X * sigma_Y),   -1 <= rho_{XY} <= +1",
          "meaning": "Normalized Pearson correlation coefficient.",
          "conditions": "Standard deviations sigma_X > 0, sigma_Y > 0."
        },
        {
          "equation": "Var(X +/- Y) = Var(X) + Var(Y) +/- 2 * Cov(X, Y)",
          "meaning": "Variance of sum and difference of two random variables.",
          "conditions": "If uncorrelated (Cov = 0), Var(X +/- Y) = Var(X) + Var(Y)."
        }
      ],
      "example": {
        "question": "Two random variables X and Y have E[X] = 2, E[Y] = 3, Var(X) = 4, Var(Y) = 9, and E[X*Y] = 8. Calculate: (i) Cov(X, Y), (ii) Correlation coefficient rho_XY, and (iii) Var(2*X - 3*Y).",
        "given": [
          "E[X] = 2, E[Y] = 3",
          "sigma_X^2 = 4 => sigma_X = 2",
          "sigma_Y^2 = 9 => sigma_Y = 3",
          "E[X*Y] = 8"
        ],
        "steps": [
          "Part (i): Cov(X, Y) = E[X*Y] - E[X]*E[Y]",
          "Cov(X, Y) = 8 - (2 * 3) = 8 - 6 = +2",
          "Part (ii): Correlation coefficient rho_XY = Cov(X, Y) / (sigma_X * sigma_Y)",
          "rho_XY = 2 / (2 * 3) = 2 / 6 = 1/3 = 0.333",
          "Part (iii): Variance of linear combination Var(a*X + b*Y) = a^2*Var(X) + b^2*Var(Y) + 2*a*b*Cov(X, Y)",
          "Here a = 2, b = -3:",
          "Var(2*X - 3*Y) = 2^2 * Var(X) + (-3)^2 * Var(Y) + 2 * (2) * (-3) * Cov(X, Y)",
          "Var = 4 * (4) + 9 * (9) - 12 * (2) = 16 + 81 - 24 = 73"
        ],
        "answer": "Cov(X, Y) = 2; rho_XY = 0.333; Var(2X - 3Y) = 73."
      },
      "gate": [
        "Independence IMPLIES Uncorrelated (rho = 0). The reverse is NOT true in general!",
        "CRITICAL EXCEPTION: If X and Y are Jointly (Bivariate) Gaussian, Uncorrelatedness (rho = 0) DOES STRICTLY IMPLY Statistical Independence!",
        "rho = +1 indicates perfect positive linear relationship (Y = a*X + b with a > 0); rho = -1 indicates perfect negative linear relationship."
      ],
      "mistakes": [
        "Writing Var(X - Y) = Var(X) - Var(Y); variance can NEVER be negative! Var(X - Y) = Var(X) + Var(Y) - 2*Cov(X, Y).",
        "Claiming two uncorrelated variables are always independent (e.g., Y = X^2 with symmetric distribution has rho = 0, but Y is completely dependent on X)."
      ],
      "diagram": "math",
      "diagramTitle": "Correlation Coefficient Scatter Plots (rho = -1, 0, +1)",
      "diagramCaption": "Scatter plots showing positive linear correlation (rho=1), negative linear correlation (rho=-1), and uncorrelated circular scatter (rho=0).",
      "studyGuide": [
        "Compute marginal densities by integrating joint density f_XY(x, y).",
        "Verify whether variables are independent by testing if f_XY(x, y) = f_X(x)*f_Y(y).",
        "Calculate covariance matrices and diagonalize them via principal component analysis (PCA)."
      ],
      "practiceQuestions": [
        {
          "question": "If two random variables X and Y are jointly Gaussian and have correlation coefficient rho_XY = 0, they are:",
          "type": "MCQ",
          "options": [
            "Statistically independent",
            "Dependent",
            "Linearly identical",
            "Mutually exclusive"
          ],
          "answer": "Statistically independent",
          "explanation": "For jointly Gaussian random variables, the joint density factors into the product of marginal densities if and only if rho = 0, making uncorrelatedness equivalent to independence."
        },
        {
          "question": "If X and Y are independent random variables with Var(X) = 5 and Var(Y) = 3, what is Var(2*X - Y)?",
          "type": "NAT",
          "answer": "23",
          "explanation": "Since X and Y are independent, Cov(X, Y) = 0. Var(2*X - Y) = 2^2 * Var(X) + (-1)^2 * Var(Y) = 4 * 5 + 1 * 3 = 20 + 3 = 23."
        }
      ],
      "quickRevision": "f_X(x) = int f_XY dy. Independent: f_XY = f_X*f_Y. Cov(X, Y) = E[XY] - E[X]E[Y]. rho = Cov/(sigma_X*sigma_Y) in [-1, +1]. Independent => rho=0 (uncorrelated). Reverse holds ONLY for Joint Gaussian! Var(aX+bY) = a^2*Var(X) + b^2*Var(Y) + 2ab*Cov(X,Y).",
      "relatedTopics": [
        "Random Variables and Distributions",
        "Probability and Statistics",
        "Bayes' Theorem, Total Probability, and Conditional Independence"
      ]
    }
  },
  {
    "title": "Newton-Raphson and Regula-Falsi Methods for Non-Linear Equations",
    "summary": "Root-finding algorithms, Newton-Raphson iteration x_(n+1) = x_n - f(x_n)/f'(x_n), quadratic convergence (order 2), Regula-Falsi (false position), and divergence conditions.",
    "orderIndex": 23,
    "lesson": {
      "intro": "Numerical root-finding methods find accurate numerical approximations to roots of non-linear algebraic and transcendental equations f(x) = 0 when closed-form analytical solutions do not exist.",
      "simple": "Newton-Raphson takes a guess at the root, draws a tangent line to the curve at that guess, and slides down the tangent to where it hits the x-axis to get a much better next guess. It zooms in on the true answer at lightning speed, doubling the number of correct decimal places on every step.",
      "why": "Convergence orders, iteration calculations, and failure modes of Newton-Raphson and Regula-Falsi are tested annually in GATE Engineering Mathematics.",
      "points": [
        "Newton-Raphson Formula: x_(n+1) = x_n - f(x_n) / f'(x_n). Derived from linear Taylor series truncation: f(x) approx f(x_n) + f'(x_n)*(x - x_n) = 0.",
        "Order of Convergence: Newton-Raphson has Quadratic Convergence (Order p = 2): error satisfies |e_(n+1)| approx K * |e_n|^2 near a simple root.",
        "Fastest convergence: Number of correct decimal places roughly doubles with each iteration.",
        "Failure modes of Newton-Raphson:",
        "1. If f'(x_n) = 0 (horizontal tangent), the formula divides by zero and fails.",
        "2. If initial guess x0 is far from root, it can diverge or oscillate in an endless loop.",
        "3. At a multiple root (f'(root) = 0), convergence degrades from quadratic to linear (order 1).",
        "Regula-Falsi (False Position) Method: Bracketing method starting with a < b such that f(a)*f(b) < 0:",
        "c = [ a*f(b) - b*f(a) ] / [ f(b) - f(a) ]. Always guaranteed to converge, but has linear convergence (order 1)."
      ],
      "formulas": [
        {
          "equation": "x_{n+1} = x_n - f(x_n) / f'(x_n)",
          "meaning": "Newton-Raphson iteration formula.",
          "conditions": "f'(x_n) != 0 in neighborhood of root."
        },
        {
          "equation": "|e_{n+1}| approx c * |e_n|^2",
          "meaning": "Quadratic convergence (order 2) of Newton-Raphson method.",
          "conditions": "Simple root (f'(alpha) != 0) with initial guess sufficiently close."
        },
        {
          "equation": "c = [ a * f(b) - b * f(a) ] / [ f(b) - f(a) ]",
          "meaning": "Regula-Falsi (Method of False Position) formula.",
          "conditions": "Root bracketed: f(a) * f(b) < 0."
        }
      ],
      "example": {
        "question": "Use the Newton-Raphson method to find the square root of 10 (i.e., solve x^2 - 10 = 0) starting with initial guess x0 = 3. Compute the first two iterations x1 and x2.",
        "given": [
          "f(x) = x^2 - 10 = 0",
          "f'(x) = 2*x",
          "Initial guess x0 = 3"
        ],
        "steps": [
          "Iteration formula: x_(n+1) = x_n - (x_n^2 - 10) / (2 * x_n) = (x_n + 10 / x_n) / 2",
          "First iteration (n = 0):",
          "x1 = (3 + 10 / 3) / 2 = (3 + 3.3333) / 2 = 6.3333 / 2 = 3.1667",
          "Second iteration (n = 1):",
          "x2 = (3.1667 + 10 / 3.1667) / 2 = (3.1667 + 3.1579) / 2 = 6.3246 / 2 = 3.1623",
          "Compare with true value: sqrt(10) = 3.162277... (accurate to 4 decimal places in just 2 steps!)"
        ],
        "answer": "x1 = 3.1667; x2 = 3.1623 (converges to sqrt(10))."
      },
      "gate": [
        "Newton-Raphson order of convergence is 2 (quadratic) for simple roots.",
        "Bisection method has order 1 (linear, error halved each step).",
        "Secant method has order 1.618 (Golden ratio).",
        "Regula-Falsi is guaranteed to converge because it brackets the root, but its order of convergence is only 1 (linear)."
      ],
      "mistakes": [
        "Forgetting to evaluate the derivative f'(xn) in the denominator.",
        "Picking an initial guess near a local extrema where f'(x) approx 0, which shoots the next estimate to infinity."
      ],
      "diagram": "math",
      "diagramTitle": "Newton-Raphson Tangent Slope Iteration",
      "diagramCaption": "Geometric tangent line at (x0, f(x0)) intersecting the x-axis to generate closer approximation x1.",
      "studyGuide": [
        "Derive Newton-Raphson formulas for reciprocal (1/N) and square root (sqrt(N)) without division.",
        "Compare orders of convergence across Bisection, Regula-Falsi, Secant, and Newton-Raphson.",
        "Identify cases where Newton-Raphson enters a period-2 oscillatory loop."
      ],
      "practiceQuestions": [
        {
          "question": "What is the order of convergence of the Newton-Raphson method for finding a simple root of a non-linear equation?",
          "type": "NAT",
          "answer": "2",
          "explanation": "For a simple root (f'(alpha) != 0), the error satisfies e_(n+1) proportional to e_n^2, giving quadratic convergence (order 2)."
        },
        {
          "question": "The Newton-Raphson iteration formula to compute the reciprocal of a positive number N (solving 1/x - N = 0) without performing division is:",
          "type": "MCQ",
          "options": [
            "x_(n+1) = x_n * (2 - N * x_n)",
            "x_(n+1) = x_n * (2 + N * x_n)",
            "x_(n+1) = (x_n + N) / 2",
            "x_(n+1) = x_n - N * x_n^2"
          ],
          "answer": "x_(n+1) = x_n * (2 - N * x_n)",
          "explanation": "f(x) = 1/x - N, f'(x) = -1/x^2. x_(n+1) = x_n - (1/x_n - N) / (-1/x_n^2) = x_n + x_n^2*(1/x_n - N) = x_n + x_n - N*x_n^2 = x_n*(2 - N*x_n)."
        }
      ],
      "quickRevision": "Newton-Raphson: x_(n+1) = x_n - f(x_n)/f'(x_n). Order of convergence = 2 (quadratic, error squared). Fails if f'(x)=0. Regula-Falsi: c = [a*f(b) - b*f(a)]/[f(b)-f(a)], order = 1, always converges. Secant method order = 1.62. Bisection order = 1.",
      "relatedTopics": [
        "Numerical Methods",
        "Calculus: Limits and Derivatives",
        "Numerical Integration: Trapezoidal Rule, Simpson's 1/3 and 3/8 Rules"
      ]
    }
  },
  {
    "title": "Numerical Integration: Trapezoidal Rule, Simpson's 1/3 and 3/8 Rules",
    "summary": "Newton-Cotes quadrature formulas, Trapezoidal rule (linear, error O(h^2)), Simpson's 1/3 rule (parabolic, error O(h^4)), Simpson's 3/8 rule, and degree of precision.",
    "orderIndex": 24,
    "lesson": {
      "intro": "Numerical Integration (Quadrature) approximates definite integrals integral_a^b f(x) dx by interpolating tabular data points with polynomials, using the Trapezoidal Rule (degree 1) and Simpson's Rules (degrees 2 and 3).",
      "simple": "When you cannot integrate a complex formula by hand, numerical quadrature chops the area under the curve into narrow vertical strips. The Trapezoidal rule connects the tops of the strips with straight lines. Simpson's rule connects them with smooth parabolic curves, giving vastly higher accuracy.",
      "why": "Evaluating definite integrals from discrete experimental data or non-integrable functions (e.g. exp(-x^2)) is a guaranteed question on GATE.",
      "points": [
        "Step size: h = (b - a) / n, where n is the number of subintervals.",
        "Trapezoidal Rule: Approximates integrand by straight line segments (n >= 1 subintervals):",
        "Integral approx (h / 2) * [ (y0 + yn) + 2 * (y1 + y2 + ... + y_(n-1)) ].",
        "- Global truncation error: E_trap = -((b - a) / 12) * h^2 * f''(xi) = O(h^2). Exact for polynomials up to degree 1.",
        "Simpson's 1/3 Rule: Approximates integrand by parabolas; REQUIRES n TO BE EVEN (n = 2, 4, 6...):",
        "Integral approx (h / 3) * [ (y0 + yn) + 4 * (sum odd y_i) + 2 * (sum even y_i) ].",
        "- Global truncation error: E_simp = -((b - a) / 180) * h^4 * f^(4)(xi) = O(h^4). Exact for polynomials up to degree 3!",
        "Simpson's 3/8 Rule: Approximates integrand by cubics; REQUIRES n TO BE A MULTIPLE OF 3 (n = 3, 6, 9...):",
        "Integral approx (3*h / 8) * [ (y0 + yn) + 3 * (y1 + y2 + y4 + y5 + ...) + 2 * (y3 + y6 + ...) ].",
        "- Global truncation error: O(h^4). Exact for polynomials up to degree 3."
      ],
      "formulas": [
        {
          "equation": "I_{trap} = (h / 2) * [ (y_0 + y_n) + 2 * sum_{i=1}^{n-1} y_i ]",
          "meaning": "Composite Trapezoidal Rule.",
          "conditions": "Any integer number of subintervals n >= 1; error is O(h^2)."
        },
        {
          "equation": "I_{simp,1/3} = (h / 3) * [ (y_0 + y_n) + 4 * sum_{odd} y_i + 2 * sum_{even} y_i ]",
          "meaning": "Composite Simpson's 1/3 Rule.",
          "conditions": "Number of subintervals n must be EVEN; error is O(h^4)."
        },
        {
          "equation": "I_{simp,3/8} = (3*h / 8) * [ (y_0 + y_n) + 3*(y_1 + y_2 + y_4 + ...) + 2*(y_3 + y_6 + ...) ]",
          "meaning": "Composite Simpson's 3/8 Rule.",
          "conditions": "Number of subintervals n must be a multiple of 3."
        }
      ],
      "example": {
        "question": "Evaluate integral_0^1 [ 1 / (1 + x) ] dx using: (a) Trapezoidal rule, and (b) Simpson's 1/3 rule with n = 2 subintervals (h = 0.5). Compare with the exact value ln(2) = 0.69315.",
        "given": [
          "f(x) = 1 / (1 + x)",
          "Interval [0, 1], n = 2 subintervals => h = (1 - 0) / 2 = 0.5"
        ],
        "steps": [
          "Calculate node points:",
          "x0 = 0.0 => y0 = 1 / (1 + 0) = 1.0000",
          "x1 = 0.5 => y1 = 1 / (1 + 0.5) = 1 / 1.5 = 0.6667",
          "x2 = 1.0 => y2 = 1 / (1 + 1) = 0.5000",
          "Part (a) Trapezoidal Rule:",
          "I_trap = (h / 2) * [ (y0 + y2) + 2 * y1 ]",
          "I_trap = (0.5 / 2) * [ (1.0 + 0.5) + 2 * (0.6667) ] = 0.25 * [ 1.5 + 1.3333 ] = 0.25 * 2.8333 = 0.7083",
          "Part (b) Simpson's 1/3 Rule:",
          "I_simp = (h / 3) * [ (y0 + y2) + 4 * y1 ]",
          "I_simp = (0.5 / 3) * [ (1.0 + 0.5) + 4 * (0.6667) ] = (0.5 / 3) * [ 1.5 + 2.6667 ] = (0.5 / 3) * 4.1667 = 0.6944",
          "Comparison: Exact value = 0.69315. Simpson's error = 0.0013, Trapezoidal error = 0.0152 (Simpson is 11 times more accurate!)."
        ],
        "answer": "Trapezoidal: 0.7083; Simpson's 1/3: 0.6944 (exact = 0.6932)."
      },
      "gate": [
        "Simpson's 1/3 rule REQUIRES the number of subintervals n to be EVEN (or number of data points to be ODD).",
        "Simpson's 3/8 rule REQUIRES n to be a multiple of 3.",
        "Degree of Precision: Trapezoidal rule is exact for polynomials of degree <= 1. Simpson's 1/3 and 3/8 rules are exact for polynomials of degree <= 3 (even though Simpson 1/3 uses 2nd-degree parabolas!).",
        "Error order: Trapezoidal error is O(h^2); Simpson's error is O(h^4)."
      ],
      "mistakes": [
        "Applying Simpson's 1/3 rule when n is odd; it CANNOT be used if n is odd.",
        "Swapping the multipliers 4 and 2 in Simpson's 1/3 formula: odd indices get multiplied by 4, even indices get multiplied by 2."
      ],
      "diagram": "math",
      "diagramTitle": "Trapezoidal Chords vs Simpson's Parabolic Strips",
      "diagramCaption": "Geometric comparison of straight-line trapezoids vs second-order parabolic curve fitting.",
      "studyGuide": [
        "Memorize the composite weights for Trapezoidal [1, 2, 2, ..., 1] and Simpson 1/3 [1, 4, 2, 4, ..., 1].",
        "Analyze the degree of precision using test polynomials 1, x, x^2, x^3.",
        "Solve tabular data integration problems from experimental measurements."
      ],
      "practiceQuestions": [
        {
          "question": "What is the degree of precision of Simpson's 1/3 rule? (i.e., the highest degree of polynomial for which it gives the exact result)",
          "type": "NAT",
          "answer": "3",
          "explanation": "Due to symmetry of the error term, odd-power error terms cancel, making Simpson's 1/3 rule exact for all cubic polynomials (degree 3) as well as quadratics."
        },
        {
          "question": "To evaluate a definite integral using Simpson's 1/3 rule, the number of subintervals n must be:",
          "type": "MCQ",
          "options": [
            "An even number",
            "An odd number",
            "A multiple of 3",
            "Any positive integer"
          ],
          "answer": "An even number",
          "explanation": "Each parabolic segment spans 2 subintervals (3 points), so the total number of subintervals n must be an even integer (n = 2, 4, 6...)."
        }
      ],
      "quickRevision": "Trapezoidal: (h/2)*[y0 + yn + 2*sum(inner)], error O(h^2), exact for degree 1. Simpson 1/3: (h/3)*[y0 + yn + 4*sum(odd) + 2*sum(even)], n MUST BE EVEN, error O(h^4), exact for degree 3. Simpson 3/8: (3h/8)*[y0 + yn + 3*(1,2,4,5..) + 2*(3,6..)], n multiple of 3.",
      "relatedTopics": [
        "Numerical Methods",
        "Integration and Applications",
        "Newton-Raphson and Regula-Falsi Methods for Non-Linear Equations"
      ]
    }
  },
  {
    "title": "Numerical Solutions of ODEs: Euler's and Runge-Kutta 4th-Order (RK4) Methods",
    "summary": "Initial Value Problems dy/dx = f(x, y), Euler's forward method (order 1), Modified Euler (order 2), and classical Runge-Kutta 4th-Order (RK4, order 4).",
    "orderIndex": 25,
    "lesson": {
      "intro": "When initial value problems dy/dx = f(x, y) with y(x0) = y0 cannot be solved analytically, numerical stepping methods\u2014Euler's Method (first order) and the Runge-Kutta 4th-Order method (RK4)\u2014integrate the solution forward in discrete steps of size h.",
      "simple": "Imagine navigating through thick fog with a compass: Euler's method checks your direction once, walks straight forward for 10 meters, and checks again (accumulating errors quickly). Runge-Kutta 4th-Order takes four careful sample readings ahead and behind to average out the bumps, giving pinpoint navigation accuracy.",
      "why": "Euler and RK4 calculations, local truncation error orders, and numerical stability are core GATE numerical analysis topics.",
      "points": [
        "Problem formulation: Initial Value Problem (IVP) dy/dx = f(x, y) with initial condition y(x0) = y0, step size h.",
        "Forward Euler's Method: y_(n+1) = y_n + h * f(x_n, y_n). Follows the tangent slope at the start of the interval.",
        "- Local truncation error: O(h^2); Global truncation error: O(h) (First-order method). Extremely slow and prone to instability.",
        "Modified / Heun's Euler Method (Order 2): Predictor-corrector scheme using the average slope of left and right endpoints: y_(n+1) = y_n + (h / 2) * [ f(x_n, y_n) + f(x_(n+1), y_predict) ]. Global error O(h^2).",
        "Runge-Kutta 4th-Order Method (RK4): The gold standard explicit numerical ODE solver:",
        "- Evaluates 4 slopes: k1 (start), k2 (midpoint using k1), k3 (midpoint using k2), and k4 (endpoint using k3).",
        "- Weighted average step: y_(n+1) = y_n + (1 / 6) * [ k1 + 2*k2 + 2*k3 + k4 ].",
        "- Global truncation error: O(h^4) (Fourth-order method). Halving step size h slashes error by 2^4 = 16 times!"
      ],
      "formulas": [
        {
          "equation": "y_{n+1} = y_n + h * f(x_n, y_n)",
          "meaning": "Forward Euler's iteration formula (first-order).",
          "conditions": "Initial value problem dy/dx = f(x, y)."
        },
        {
          "equation": "y_{n+1} = y_n + (1 / 6) * [ k_1 + 2*k_2 + 2*k_3 + k_4 ]",
          "meaning": "Classical Runge-Kutta 4th-Order (RK4) formula.",
          "conditions": "Fourth-order accurate (global error O(h^4))."
        },
        {
          "equation": "k_1 = h*f(x_n, y_n),   k_2 = h*f(x_n + h/2, y_n + k_1/2),   k_3 = h*f(x_n + h/2, y_n + k_2/2),   k_4 = h*f(x_n + h, y_n + k_3)",
          "meaning": "Four intermediate slope increments of RK4.",
          "conditions": "Evaluated sequentially."
        }
      ],
      "example": {
        "question": "Given the initial value problem dy/dx = x + y with y(0) = 1, use Euler's method with step size h = 0.1 to estimate y(0.2) in two steps. Then calculate the initial slope k1 for the RK4 method.",
        "given": [
          "f(x, y) = x + y",
          "x0 = 0, y0 = 1",
          "Step size h = 0.1"
        ],
        "steps": [
          "Step 1 (from x0 = 0 to x1 = 0.1):",
          "Slope at (0, 1): f(x0, y0) = 0 + 1 = 1",
          "y1 = y0 + h * f(x0, y0) = 1 + 0.1 * (1) = 1.1",
          "x1 = 0.1, y1 = 1.1",
          "Step 2 (from x1 = 0.1 to x2 = 0.2):",
          "Slope at (0.1, 1.1): f(x1, y1) = 0.1 + 1.1 = 1.2",
          "y2 = y1 + h * f(x1, y1) = 1.1 + 0.1 * (1.2) = 1.1 + 0.12 = 1.22",
          "Now calculate RK4 initial increment k1:",
          "k1 = h * f(x0, y0) = 0.1 * (0 + 1) = 0.10"
        ],
        "answer": "Euler estimate y(0.2) = 1.22; RK4 initial increment k1 = 0.10 (Exact analytical y(0.2) = 1.2428)."
      },
      "gate": [
        "Euler's method has order 1 (global error O(h)); Modified Euler has order 2 (O(h^2)); RK4 has order 4 (O(h^4)).",
        "In RK4, the weights in the weighted average are 1, 2, 2, 1, normalized by dividing by 1 + 2 + 2 + 1 = 6.",
        "Halving the step size h in RK4 reduces error by a factor of 2^4 = 16."
      ],
      "mistakes": [
        "Confusing local truncation error with global truncation error: Euler local error is O(h^2), but global accumulated error is O(h).",
        "Evaluating k3 using k1 instead of k2: k3 requires y_n + k2 / 2."
      ],
      "diagram": "math",
      "diagramTitle": "Euler Tangent Step vs RK4 4-Slope Weighted Average",
      "diagramCaption": "Geometric progression showing Euler single slope vs RK4 midpoint predictor-corrector slopes.",
      "studyGuide": [
        "Perform 2 to 3 iterations of Forward Euler by hand.",
        "Calculate k1, k2, k3, k4 step-by-step for simple linear ODEs.",
        "Compare stability limits of explicit Euler vs implicit backward Euler for stiff ODEs."
      ],
      "practiceQuestions": [
        {
          "question": "If the step size h is halved in the Runge-Kutta 4th-Order (RK4) method, the global truncation error is reduced by approximately a factor of:",
          "type": "NAT",
          "answer": "16",
          "explanation": "RK4 is a fourth-order method with global error proportional to h^4. Halving h (h/2) reduces error by (1/2)^4 = 1/16, so error drops by factor 16."
        },
        {
          "question": "Using Euler's method for dy/dx = -2*y with y(0) = 1 and step size h = 0.1, the value of y(0.1) is:",
          "type": "NAT",
          "answer": "0.8",
          "explanation": "y1 = y0 + h * f(x0, y0) = 1 + 0.1 * (-2 * 1) = 1 - 0.2 = 0.8."
        }
      ],
      "quickRevision": "IVP: dy/dx = f(x, y). Euler: y_(n+1) = y_n + h*f(x_n, y_n), order 1 (O(h)). Modified Euler: order 2 (O(h^2)). RK4: y_(n+1) = y_n + (1/6)*(k1 + 2*k2 + 2*k3 + k4), order 4 (O(h^4)). Halving h in RK4 cuts error by 16x.",
      "relatedTopics": [
        "Higher-Order Linear Ordinary Differential Equations with Constant Coefficients",
        "Numerical Methods",
        "First-Order Transient Analysis"
      ]
    }
  }
];
