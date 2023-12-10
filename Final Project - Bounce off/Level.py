import json
import numpy as np

class Obstacle:
    def __init__(self, is_hard, freq, x, y):
        self.x = x
        self.y = y
        self.is_hard = is_hard
        self.freq = freq
        self.color = "black" if is_hard else "grey"

    def to_dict(self):
        return {
            "x": self.x,
            "y": self.y,
            "is_hard": self.is_hard,
            "freq": self.freq,
            "color": self.color
        }

class Rectangle(Obstacle):
    def __init__(self, is_hard, freq, x=None, y=None, width=None, height=None, xc=None, yc=None):
        if xc is not None and yc is not None:
            x = xc - width // 2
            y = yc - height // 2
        super().__init__(is_hard, freq, x, y)
        self.width = width
        self.height = height

    def to_dict(self):
        d = super().to_dict()
        d["width"] = self.width
        d["height"] = self.height
        return d

    



class Square(Rectangle):
    def __init__(self, is_hard, freq, x=None, y=None, size=None, xc=None, yc=None):
        super().__init__(is_hard, freq, x, y, size, size, xc, yc)

    def to_dict(self):
        d = super().to_dict()
        d["size"] = self.width
        return d
    

class Line(Obstacle):
    def __init__(self, is_hard, freq, x1, y1, x2, y2):
        super().__init__(is_hard, freq,x1, y1)
        self.x2 = x2
        self.y2 = y2

    def to_dict(self):
        d = super().to_dict()
        d["x2"] = self.x2
        d["y2"] = self.y2
        return d

    

class Disc(Obstacle):
    def __init__(self, is_hard, freq, x, y, radius):
        super().__init__(is_hard, freq, x, y)
        self.radius = radius

    def to_dict(self):
        d = super().to_dict()
        d["radius"] = self.radius
        return d
    
class Triangle(Obstacle):
    def __init__(self, is_hard, freq, x1, y1, x2, y2, x3, y3):
        super().__init__(is_hard, freq, x1, y1)
        self.x2 = x2
        self.y2 = y2
        self.x3 = x3
        self.y3 = y3
    
    def to_dict(self):
        d = super().to_dict()
        d["x2"] = self.x2
        d["y2"] = self.y2
        d["x3"] = self.x3
        d["y3"] = self.y3
        return d
    
class RightTriangle(Triangle):
    def __init__(self, is_hard, freq, xc, yc, side_len, direction):
        # direction is angle in degrees
        theta = direction / 180 * np.pi
        hypotenuse_center = np.array([xc, yc])
        half_hpt = side_len / np.sqrt(2)
        right_angle_vertex = hypotenuse_center - half_hpt * np.array([np.cos(theta), np.sin(theta)])
        vertex_1 = hypotenuse_center + half_hpt * np.array([np.cos(theta + np.pi / 2), np.sin(theta + np.pi / 2)])
        vertex_2 = hypotenuse_center + half_hpt * np.array([np.cos(theta - np.pi / 2), np.sin(theta - np.pi / 2)])
        super().__init__(is_hard, freq, vertex_1[0], vertex_1[1], right_angle_vertex[0], right_angle_vertex[1], vertex_2[0], vertex_2[1])

        self.xc = xc
        self.yc = yc
        self.side_len = side_len
        self.direction = direction


class Level:
    def __init__(self, name, bouncer_size=20):
        self.name = name
        self.obstacles = []
        self.bouncer_size = bouncer_size

    def add_obstacle(self, obstacle):
        self.obstacles.append(obstacle)

    def to_dict(self):
        # squares = [obstacle for obstacle in self.obstacles if isinstance(obstacle, Square)]
        # discs = [obstacle for obstacle in self.obstacles if isinstance(obstacle, Disc)]
    
        return {
            "name": self.name,
            "squares": [square.to_dict() for square in self.obstacles if isinstance(square, Square)],
            "discs": [disc.to_dict() for disc in self.obstacles if isinstance(disc, Disc)],
            "rectangles": [rectangle.to_dict() for rectangle in self.obstacles if isinstance(rectangle, Rectangle)],
            "triangles": [triangle.to_dict() for triangle in self.obstacles if isinstance(triangle, Triangle)],
            "bouncer_size": self.bouncer_size,
        }

class GameLevelGenerator:
    def __init__(self):
        self.levels = []

    def add_level(self, level):
        self.levels.append(level)

    def save_to_json(self, file_name):
        with open(file_name, 'w') as file:
            json.dump([level.to_dict() for level in self.levels], file, indent=4)
