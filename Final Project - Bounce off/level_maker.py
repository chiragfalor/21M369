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
    def __init__(self, is_hard, freq, x, y, radius  ):
        super().__init__(is_hard, freq, x, y)
        self.radius = radius

    def to_dict(self):
        d = super().to_dict()
        d["radius"] = self.radius
        return d

class Level:
    def __init__(self, name):
        self.name = name
        self.obstacles = []

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
    level1.add_obstacle(Disc(False, 60, 400, 400, 100,))
    return level1

def two_rectangles():
    level2 = Level("two_rectangles")
    level2.add_obstacle(Rectangle(False, 60, 100, 100, 50, 500))
    level2.add_obstacle(Rectangle(False, 72, 500, 100, 50, 500, ))
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
    scale = [60, 62, 64, 65, 67, 69, 71, 72]
    for i in range(8):
        level5.add_obstacle(Rectangle(False, scale[i], xc=xc, yc=-1*(-1)**(i%2)* (i+4)//2 * 50 + 400, width=width, height=height))

    return level5

def wall_in_between():
    level6 = Level("wall_in_between")
    level6.add_obstacle(Rectangle(False, 60, xc=200, yc=600, width=100, height=100))
    level6.add_obstacle(Rectangle(False, 72, xc=600, yc=600, width=100, height=100))

    # add wall
    level6.add_obstacle(Rectangle(True, 0, xc=400, yc=600, width=50, height=300))
    # add bouncer at top
    level6.add_obstacle(Rectangle(True, 0, xc=400, yc=200, width=300, height=50))

    return level6

if __name__ == "__main__":
    generator = GameLevelGenerator()

    # generator.add_level(create_basic_level())
    # generator.add_level(two_rectangles())
    # generator.add_level(disc_and_sphere())
    # generator.add_level(four_rectangles())
    # generator.add_level(multiple_vertical_bounces())
    generator.add_level(wall_in_between())

    # Save to JSON in the current directory
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    generator.save_to_json(os.path.join(cur_dir, "levels.json"))
