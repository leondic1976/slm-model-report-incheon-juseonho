import tkinter as tk
import math
import re
import numpy as np
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk
from matplotlib.figure import Figure

class GraphWindow:
    def __init__(self, parent):
        self.window = tk.Toplevel(parent)
        self.window.title("Function Graph")
        self.window.geometry("700x550")
        self.window.resizable(True, True)

        control_frame = tk.Frame(self.window)
        control_frame.pack(fill=tk.X, padx=5, pady=5)

        tk.Label(control_frame, text="f(x) =", font=("Consolas", 11)).pack(side=tk.LEFT, padx=(0, 5))

        self.func_entry = tk.Entry(control_frame, font=("Consolas", 11), width=25)
        self.func_entry.pack(side=tk.LEFT, padx=(0, 10))
        self.func_entry.insert(0, "sin(x)")
        self.func_entry.bind("<Return>", lambda e: self.plot())

        tk.Label(control_frame, text="x min:", font=("Consolas", 10)).pack(side=tk.LEFT, padx=(0, 2))
        self.xmin_entry = tk.Entry(control_frame, font=("Consolas", 10), width=6)
        self.xmin_entry.pack(side=tk.LEFT, padx=(0, 5))
        self.xmin_entry.insert(0, "-10")

        tk.Label(control_frame, text="x max:", font=("Consolas", 10)).pack(side=tk.LEFT, padx=(0, 2))
        self.xmax_entry = tk.Entry(control_frame, font=("Consolas", 10), width=6)
        self.xmax_entry.pack(side=tk.LEFT, padx=(0, 10))
        self.xmax_entry.insert(0, "10")

        self.plot_btn = tk.Button(
            control_frame, text="Plot", font=("Arial", 10, "bold"),
            bg="#4a90d9", fg="white", command=self.plot
        )
        self.plot_btn.pack(side=tk.LEFT)

        self.fig = Figure(figsize=(6, 4.5), dpi=100)
        self.ax = self.fig.add_subplot(111)
        self.ax.set_xlabel("x")
        self.ax.set_ylabel("f(x)")
        self.ax.grid(True, alpha=0.3)
        self.ax.axhline(y=0, color="black", linewidth=0.5)
        self.ax.axvline(x=0, color="black", linewidth=0.5)

        self.canvas = FigureCanvasTkAgg(self.fig, master=self.window)
        self.canvas.draw()

        toolbar_frame = tk.Frame(self.window)
        toolbar_frame.pack(fill=tk.X, padx=5, pady=(0, 5))
        toolbar = NavigationToolbar2Tk(self.canvas, toolbar_frame)
        toolbar.update()

        self.canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True, padx=5, pady=(0, 5))

        self.plot()

    def safe_eval_func(self, expr, x_val):
        allowed = {
            "abs": abs, "round": round, "int": int, "float": float,
            "math": math, "np": np,
            "sin": math.sin, "cos": math.cos, "tan": math.tan,
            "asin": math.asin, "acos": math.acos, "atan": math.atan,
            "sinh": math.sinh, "cosh": math.cosh, "tanh": math.tanh,
            "log": math.log10, "ln": math.log, "log10": math.log10,
            "sqrt": math.sqrt, "exp": math.exp, "pi": math.pi, "e": math.e,
            "radians": math.radians, "degrees": math.degrees,
            "ceil": math.ceil, "floor": math.floor, "fabs": math.fabs,
        }
        allowed.update(math.__dict__)
        code = compile(expr, "<string>", "eval", flags=0)
        for name in code.co_names:
            if name not in allowed and name not in dir(math):
                raise NameError(f"Not allowed: {name}")
        return eval(code, {"__builtins__": {}}, {**allowed, "x": x_val, "np": np})

    def plot(self):
        expr = self.func_entry.get().strip()
        if not expr:
            return

        try:
            xmin = float(self.xmin_entry.get())
            xmax = float(self.xmax_entry.get())
        except ValueError:
            return

        if xmin >= xmax:
            return

        x = np.linspace(xmin, xmax, 2000)
        y = np.full_like(x, np.nan)

        for i in range(len(x)):
            try:
                y[i] = self.safe_eval_func(expr, x[i])
            except Exception:
                y[i] = np.nan

        self.ax.clear()
        self.ax.plot(x, y, color="#4a90d9", linewidth=1.5)
        self.ax.set_xlabel("x")
        self.ax.set_ylabel("f(x)")
        self.ax.set_title(f"f(x) = {expr}")
        self.ax.grid(True, alpha=0.3)
        self.ax.axhline(y=0, color="black", linewidth=0.5)
        self.ax.axvline(x=0, color="black", linewidth=0.5)
        self.ax.relim()
        self.ax.autoscale_view()
        self.canvas.draw()


class ScientificCalculator:
    def __init__(self, root):
        self.root = root
        self.root.title("Scientific Calculator")
        self.root.resizable(False, False)
        self.expression = ""
        self.result_var = tk.StringVar(value="0")

        self.create_widgets()
        self.bind_keys()

    def create_widgets(self):
        display_frame = tk.Frame(self.root, height=80)
        display_frame.pack(fill=tk.X, padx=5, pady=(5, 0))

        self.display = tk.Entry(
            display_frame, textvariable=self.result_var,
            font=("Consolas", 20), justify=tk.RIGHT,
            bd=5, relief=tk.RIDGE, state="readonly"
        )
        self.display.pack(fill=tk.BOTH, ipady=10)

        btn_frame = tk.Frame(self.root)
        btn_frame.pack(padx=5, pady=5)

        buttons = [
            ("sin", 0, 0), ("cos", 0, 1), ("tan", 0, 2), ("π", 0, 3),
            ("e", 0, 4), ("C", 0, 5), ("⌫", 0, 6), ("(", 0, 7),
            ("asin", 1, 0), ("acos", 1, 1), ("atan", 1, 2), ("log", 1, 3),
            ("ln", 1, 4), ("x²", 1, 5), ("√", 1, 6), (")", 1, 7),
            ("sinh", 2, 0), ("cosh", 2, 1), ("tanh", 2, 2), ("x!", 2, 3),
            ("10^x", 2, 4), ("x³", 2, 5), ("1/x", 2, 6), ("%", 2, 7),
            ("7", 3, 0, 1), ("8", 3, 1, 1), ("9", 3, 2, 1), ("÷", 3, 3, 1),
            ("4", 4, 0, 1), ("5", 4, 1, 1), ("6", 4, 2, 1), ("×", 4, 3, 1),
            ("1", 5, 0, 1), ("2", 5, 1, 1), ("3", 5, 2, 1), ("-", 5, 3, 1),
            ("0", 6, 0, 1), (".", 6, 1, 1), ("±", 6, 2, 1), ("+", 6, 3, 1),
            ("Graph", 7, 4), ("=", 7, 0, 4, 2),
        ]

        for i in range(8):
            for j in range(8):
                btn_frame.grid_rowconfigure(i, weight=1, minsize=40)
                btn_frame.grid_columnconfigure(j, weight=1, minsize=55)

        for btn in buttons:
            text = btn[0]
            r, c = btn[1], btn[2]
            colspan = btn[3] if len(btn) > 3 else 1
            rowspan = btn[4] if len(btn) > 4 else 1

            if text == "=":
                self.create_button(btn_frame, text, r, c, colspan, rowspan, highlight=True)
            elif text in ("C", "⌫"):
                self.create_button(btn_frame, text, r, c, colspan, rowspan, accent=True)
            elif text == "Graph":
                self.create_button(btn_frame, text, r, c, colspan, rowspan, func=True)
            elif text in ("(", ")", "÷", "×", "-", "+", "%", ".", "x²", "x³", "√", "1/x", "±", "x!", "10^x"):
                self.create_button(btn_frame, text, r, c, colspan, rowspan)
            elif text in ("sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh", "log", "ln"):
                self.create_button(btn_frame, text, r, c, colspan, rowspan, func=True)
            else:
                self.create_button(btn_frame, text, r, c, colspan, rowspan)

        status_frame = tk.Frame(self.root)
        status_frame.pack(fill=tk.X, padx=5, pady=(0, 5))
        self.status_label = tk.Label(status_frame, text="Ready", anchor=tk.W, font=("Consolas", 9), fg="gray")
        self.status_label.pack(fill=tk.X)

    def create_button(self, parent, text, row, col, colspan=1, rowspan=1, highlight=False, accent=False, func=False):
        fg = "white"
        bg = "#4a90d9" if highlight else ("#d9534f" if accent else ("#6c757d" if func else "#343a40"))
        active_bg = "#357abd" if highlight else ("#c9302c" if accent else "#5a6268")
        font_spec = ("Arial", 12, "bold") if highlight else ("Arial", 10)

        btn = tk.Button(
            parent, text=text, font=font_spec,
            fg=fg, bg=bg, activeforeground="white", activebackground=active_bg,
            bd=1, relief=tk.RAISED, cursor="hand2",
            command=lambda t=text: self.on_button_click(t)
        )
        btn.grid(row=row, column=col, columnspan=colspan, rowspan=rowspan, sticky="nsew", padx=1, pady=1)
        return btn

    def on_button_click(self, text):
        if text == "Graph":
            GraphWindow(self.root)
        elif text == "C":
            self.expression = ""
            self.result_var.set("0")
            self.status_label.config(text="Cleared")
        elif text == "⌫":
            self.expression = self.expression[:-1]
            self.result_var.set(self.expression if self.expression else "0")
        elif text == "=":
            self.calculate()
        elif text == "±":
            self.toggle_sign()
        elif text == "π":
            self.expression += str(math.pi)
            self.result_var.set(self.expression)
        elif text == "e":
            self.expression += str(math.e)
            self.result_var.set(self.expression)
        elif text == "x²":
            self.expression += "**2"
            self.result_var.set(self.expression)
        elif text == "x³":
            self.expression += "**3"
            self.result_var.set(self.expression)
        elif text == "√":
            self.expression = self.expression.rstrip()
            self.expression += "**(0.5)" if self.expression and self.expression[-1] in "0123456789)" else "sqrt("
            self.result_var.set(self.expression)
        elif text == "1/x":
            self.expression = f"1/({self.expression})" if self.expression else "1/("
            self.result_var.set(self.expression)
        elif text == "x!":
            self.expression += "!"
            self.result_var.set(self.expression)
        elif text == "10^x":
            self.expression += "10**"
            self.result_var.set(self.expression)
        elif text == "%":
            self.expression += "%"
            self.result_var.set(self.expression)
        elif text == "×":
            self.expression += "*"
            self.result_var.set(self.expression)
        elif text == "÷":
            self.expression += "/"
            self.result_var.set(self.expression)
        elif text in ("sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh", "log", "ln"):
            func_map = {
                "sin": "math.sin", "cos": "math.cos", "tan": "math.tan",
                "asin": "math.asin", "acos": "math.acos", "atan": "math.atan",
                "sinh": "math.sinh", "cosh": "math.cosh", "tanh": "math.tanh",
                "log": "math.log10", "ln": "math.log",
            }
            self.expression += func_map[text] + "("
            self.result_var.set(self.expression)
        else:
            self.expression += text
            self.result_var.set(self.expression)

    def toggle_sign(self):
        if not self.expression:
            return
        if self.expression.startswith("-"):
            self.expression = self.expression[1:]
        else:
            self.expression = "-" + self.expression
        self.result_var.set(self.expression)

    def calculate(self):
        expr = self.expression
        if not expr:
            return

        try:
            expr = self.preprocess(expr)
            result = self.safe_eval(expr)
            if result is not None:
                formatted = self.format_result(result)
                self.result_var.set(formatted)
                self.expression = str(result)
                self.status_label.config(text="=" + formatted)
            else:
                self.result_var.set("Error")
                self.status_label.config(text="Math Error")
        except Exception as e:
            self.result_var.set("Error")
            self.status_label.config(text=str(e)[:40] if str(e) else "Error")

    def preprocess(self, expr):
        expr = expr.replace("×", "*").replace("÷", "/")

        expr = re.sub(r'(\d+)\(', r'\1*(', expr)
        expr = re.sub(r'\)(\d)', r')*\1', expr)
        expr = re.sub(r'\)\(', r')*(', expr)

        expr = re.sub(r'(\d+)!', r'math.factorial(\1)', expr)
        expr = re.sub(r'\(([^)]+)\)!', r'math.factorial(\1)', expr)

        for func in ["math.sin", "math.cos", "math.tan",
                      "math.asin", "math.acos", "math.atan",
                      "math.sinh", "math.cosh", "math.tanh",
                      "math.log10", "math.log", "math.sqrt"]:
            expr = expr.replace(func, func)

        return expr

    def safe_eval(self, expr):
        allowed = {
            "abs": abs, "round": round, "int": int, "float": float,
            "math": math,
        }
        allowed.update(math.__dict__)

        compiled = compile(expr, "<string>", "eval", flags=0)

        for var_name in compiled.co_names:
            if var_name not in allowed and var_name not in dir(math):
                raise NameError(f"Not allowed: {var_name}")

        result = eval(compiled, {"__builtins__": {}}, allowed)
        return result

    def format_result(self, value):
        if isinstance(value, float):
            if value == int(value) and abs(value) < 1e15:
                return str(int(value))
            formatted = f"{value:.10f}".rstrip("0").rstrip(".")
            return formatted
        return str(value)

    def bind_keys(self):
        valid_keys = "0123456789.+-*/%()"
        self.root.bind("<Key>", lambda e: self.key_press(e.char) if e.char in valid_keys else None)
        self.root.bind("<Return>", lambda e: self.calculate())
        self.root.bind("<BackSpace>", lambda e: self.on_button_click("⌫"))
        self.root.bind("<Escape>", lambda e: self.on_button_click("C"))

    def key_press(self, char):
        self.expression += char
        self.result_var.set(self.expression)


if __name__ == "__main__":
    root = tk.Tk()
    app = ScientificCalculator(root)
    root.mainloop()
