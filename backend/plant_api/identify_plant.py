import torch
import timm
from torch import nn
from collections import OrderedDict

class IdentifyPlant(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        # Create model with exact architecture matching your checkpoint
        self.model = timm.create_model(
            'vit_tiny_patch16_224',
            pretrained=False,
            num_classes=num_classes,
            embed_dim=192,  # Force the correct dimension
            depth=12,      # Must match your checkpoint's 12 blocks
            num_heads=3,    # Typically 192/64=3 heads
        )

    def forward(self, x):
        return self.model(x)

def load_model(num_classes=15, path="identify_plant.pth"):
    # Option 1: Load directly into the ViT model (recommended)
    model = timm.create_model(
        'vit_tiny_patch16_224',
        pretrained=False,
        num_classes=num_classes,
        embed_dim=192,
        depth=12,
        num_heads=3,
    )
    
    checkpoint = torch.load(path, map_location='cpu')
    state_dict = checkpoint.get('state_dict', checkpoint)
    
    # Remove any DataParallel prefixes
    state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}
    
    model.load_state_dict(state_dict)
    model.eval()
    return model

    # Option 2: If you really need the IdentifyPlant wrapper
    # model = IdentifyPlant(num_classes)
    # model.model.load_state_dict(state_dict)  # Load directly into inner model
    # model.eval()
    # return model

