import Image from 'next/image';
import { toolIcons } from '@/config/toolIcons';

interface ToolIconProps {
  tool: keyof typeof toolIcons;
  size?: number;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ 
  tool, 
  size = 40,
  className = ''
}) => {
  const toolConfig = toolIcons[tool];

  if (!toolConfig) {
    return null;
  }

  return (
    <div 
      className={`relative flex items-center justify-center rounded-lg ${className}`}
      style={{ 
        backgroundColor: toolConfig.color,
        width: size,
        height: size
      }}
    >
      <Image
        src={toolConfig.svgPath}
        alt={`${toolConfig.name} logo`}
        width={size * 0.6}
        height={size * 0.6}
        className="object-contain"
      />
    </div>
  );
}; 