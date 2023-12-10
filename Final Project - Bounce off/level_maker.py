import json
import os

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

def create_basic_level():
    level1 = Level("one_disc")
    # level1.add_obstacle(Square(100, 100, 50, False, 55))
    level1.add_obstacle(Disc(False, 60, 600, 400, 100,))
    level1.add_obstacle(Rectangle(True, 0, 50, 300, 400, 50))
    
    level1.add_obstacle(Rectangle(True, 0, 50, 500, 400, 50))
    return level1

def two_rectangles():
    level2 = Level("two_rectangles")
    level2.add_obstacle(Rectangle(False, 60, 200, 100, 50, 500))
    level2.add_obstacle(Rectangle(False, 72, 600, 100, 50, 500, ))
    return level2

def disc_and_sphere():
    level3 = Level("disc_and_sphere")
    level3.add_obstacle(Disc(False, 60, 400, 400, 100, ))
    level3.add_obstacle(Square(False, 55, 100, 100, 50, ))
    return level3
# notes to midi:
note_to_midi = {
    "C": 60,
    "C#": 61,
    "D": 62,
    "D#": 63,
    "E": 64,
    "F": 65,
    "F#": 66,
    "G": 67,
    "G#": 68,
    "A": 69,
    "A#": 70,
    "B": 71
}
scale = [0, 2, 4, 5, 7, 9, 11, 12]
def four_rectangles():
    level4 = Level("four_rectangles")
    level4.add_obstacle(Rectangle(False, 60, xc=400, yc=200, width=300, height=50))
    level4.add_obstacle(Rectangle(False, 64, xc=200, yc=400, width=50, height=300))
    level4.add_obstacle(Rectangle(False, 67, xc=400, yc=600, width=300, height=50))
    level4.add_obstacle(Rectangle(False, 72, xc=600, yc=400, width=50, height=300))
    return level4

def multiple_vertical_bounces():
    height = 20
    width = 500
    xc = 400
    level5 = Level("multiple_vertical_bounces")
    C_scale = [60+s for s in scale] # C major scale
    for i in range(8):
        level5.add_obstacle(Rectangle(False, C_scale[i], xc=xc, yc=-1*(-1)**(i%2)* (i+4)//2 * 50 + 400, width=width, height=height))

    return level5

def wall_in_between():
    level6 = Level("wall_in_between")
    level6.add_obstacle(Rectangle(False, 60, xc=200, yc=200, width=100, height=100))
    level6.add_obstacle(Rectangle(False, 72, xc=600, yc=200, width=100, height=100))

    # add wall
    level6.add_obstacle(Rectangle(True, 0, xc=400, yc=200, width=50, height=300))
    # add bouncer at top
    level6.add_obstacle(Rectangle(True, 0, xc=400, yc=600, width=300, height=50))

    return level6

def multiple_horizontal_bounces():
    height = 100
    width = 50
    x1 = 200
    x2 = 600
    level7 = Level("multiple_horizontal_bounces")
    A_scale = [69+s for s in scale] # A major scale
    for i in range(8):
        level7.add_obstacle(Rectangle(False, A_scale[i], xc=x1 if i%2 == 0 else x2, yc=200+(i) * 60, width=width, height=height))

    return level7

def ode_to_joy():
    level8 = Level("ode_to_joy", bouncer_size=15)
    # main chorus
    chorus = [2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1]
    extra = [2, 1, 0, 0]
    key = 69

    left_x = 250
    right_x = 550
    height = 80
    width = 200
    init_y = 50
    for i in range(len(chorus)):
        level8.add_obstacle(Rectangle(False, key + scale[chorus[i]], 
                                      xc=left_x if i%2 == 0 else right_x, 
                                      yc=init_y+(i) * (height // 2 + 10), 
                                      width=width, height=height))
    # add vertical rectangle
    level8.add_obstacle(Rectangle(False, key + scale[extra[0]], 
                                  xc=right_x - 50, 
                                  yc=init_y + len(chorus) * (height // 2 + 10) + 50,
                                  width=80, height=200))
    # add horizontal rectangle
    level8.add_obstacle(Rectangle(False, key + scale[extra[1]], 
                                  xc=left_x,
                                  yc=init_y + len(chorus) * (height // 2 + 10)+ 60,
                                  width=width, height=height))
    # add vertical rectangle
    level8.add_obstacle(Rectangle(False, key + scale[extra[2]], 
                                  xc=right_x + 50, 
                                  yc=init_y + len(chorus) * (height // 2 + 10)+ 50,
                                  width=80, height=200))
    # add horizontal rectangle
    level8.add_obstacle(Rectangle(False, key + scale[extra[3]], 
                                  xc=right_x,
                                  yc=init_y + len(chorus) * (height // 2 + 10) + 190,
                                  width=width, height=20))
    return level8

def create_simple_triangle():
    level9 = Level("simple_triangle")
    level9.add_obstacle(Triangle(False, 60, 200, 100, 400, 100, 300, 300))
    return level9



if __name__ == "__main__":
    generator = GameLevelGenerator()

    # generator.add_level(create_basic_level())
    # generator.add_level(two_rectangles())
    # generator.add_level(disc_and_sphere())
    # generator.add_level(four_rectangles())
    # generator.add_level(multiple_vertical_bounces())
    # generator.add_level(wall_in_between())
    # generator.add_level(multiple_horizontal_bounces())
    # generator.add_level(ode_to_joy())
    generator.add_level(create_simple_triangle())

    # Save to JSON in the current directory
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    generator.save_to_json(os.path.join(cur_dir, "levels.json"))
