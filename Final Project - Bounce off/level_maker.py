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
    def __init__(self, is_hard, freq, x, y, width, height,):
        super().__init__(is_hard, freq, x, y)
        self.width = width
        self.height = height

    def to_dict(self):
        d = super().to_dict()
        d["width"] = self.width
        d["height"] = self.height
        return d

    



class Square(Rectangle):
    def __init__(self, is_hard, freq, x, y, size):
        super().__init__(is_hard, freq, x, y, size, size)

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
    # level4.add_obstacle(Rectangle(False, 60, 400, 200, 500, 50))

    return level4

if __name__ == "__main__":
    generator = GameLevelGenerator()

    generator.add_level(create_basic_level())
    generator.add_level(two_rectangles())
    generator.add_level(disc_and_sphere())
    generator.add_level(four_rectangles())

    # Save to JSON in the current directory
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    generator.save_to_json(os.path.join(cur_dir, "levels.json"))
