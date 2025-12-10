const vertexShaderSource = `#version 300 es
in vec3 aPosition;
in vec3 aColor;
in vec3 aNormal;
in vec2 aTexCoord;

uniform float uTime;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelTransformationMatrix;
uniform mat4 uScaleTransformationMatrix;
uniform mat4 uTranslateTransformationMatrix;
uniform mat3 uNormalMatrix;

out vec3 vColor;
out vec3 vPosition;
out vec3 vNormal;
out vec2 vTexCoord;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * uTranslateTransformationMatrix * uModelTransformationMatrix * uScaleTransformationMatrix * vec4(aPosition, 1.0);
  vNormal = normalize(uNormalMatrix * aNormal);
  vColor = aColor;
  vPosition = gl_Position.xyz;
  vTexCoord = aTexCoord;
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
in vec3 vColor;
in vec3 vPosition;
in vec3 vNormal;
in vec2 vTexCoord;
uniform float uBumpStrength;
uniform float uAlpha;
uniform vec3 uKa;
uniform vec3 uKd;
uniform vec3 uKs;
uniform vec3 uViewPos;
uniform vec3 uPointPos;
uniform vec3 uSpotlightPos;
uniform bool uUseTexture;
uniform sampler2D uTexture;

out vec4 fragColor;

vec3 calculateLight(vec3 lightPos, vec3 normal, vec3 viewDir) {
    vec3 lightDir = normalize(lightPos - vPosition);
    float cosTheta = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = uKd * cosTheta * vColor;
    vec3 reflectDir = -reflect(lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uAlpha);
    vec3 specular = uKs * spec * vec3(1.0);
    return diffuse + specular;
}

void main() {
  vec3 color = vColor;
  vec3 normal = vNormal;
  
  if (uUseTexture) {
    float h = texture(uTexture, vTexCoord).r;
    float hu = texture(uTexture, vTexCoord + vec2(0.01, 0.0)).r;
    float hv = texture(uTexture, vTexCoord + vec2(0.0, 0.01)).r;
    vec3 gradient = vec3((hu - h) * uBumpStrength, (hv - h) * uBumpStrength, 0.1);
    normal = normalize(normal + gradient);
    vec4 texColor = texture(uTexture, vTexCoord);
    color = texColor.rgb;
  }
  
  vec3 viewDir = normalize(uViewPos - vPosition);
  vec3 colorWithLight = uKa * color;
  colorWithLight += calculateLight(uPointPos, normal, viewDir);
  colorWithLight += calculateLight(uSpotlightPos, normal, viewDir);
  fragColor = vec4(colorWithLight, 1.0);
}`;

const ghostFragmentShaderSource = `#version 300 es
precision mediump float;
in vec3 vColor;
in vec3 vPosition;
in vec3 vNormal;
out vec4 fragColor;

void main() {
  fragColor = vec4(1.0, 0.0, 0.0, 0.3);
}`;

