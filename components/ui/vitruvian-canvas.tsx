'use client'

function VitruvianMark() {
  return (
    <svg viewBox='0 0 512 512' className='vitruvian-logo-svg' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <linearGradient id='goldMetal' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#7d5b1e' />
          <stop offset='14%' stopColor='#d6b15a' />
          <stop offset='28%' stopColor='#fff2b8' />
          <stop offset='42%' stopColor='#b7832d' />
          <stop offset='58%' stopColor='#f6dd90' />
          <stop offset='76%' stopColor='#9b6f27' />
          <stop offset='100%' stopColor='#e3c36f' />
        </linearGradient>
        <linearGradient id='goldSoft' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='#fff6cb' />
          <stop offset='100%' stopColor='#c08e35' />
        </linearGradient>
        <radialGradient id='goldGlow' cx='50%' cy='40%' r='55%'>
          <stop offset='0%' stopColor='rgba(255,244,196,0.95)' />
          <stop offset='55%' stopColor='rgba(214,177,90,0.36)' />
          <stop offset='100%' stopColor='rgba(214,177,90,0)' />
        </radialGradient>
        <filter id='softGlow' x='-30%' y='-30%' width='160%' height='160%'>
          <feGaussianBlur stdDeviation='8' result='blur' />
          <feMerge>
            <feMergeNode in='blur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>

      <circle cx='256' cy='256' r='208' fill='url(#goldGlow)' opacity='0.55' />
      <circle cx='256' cy='256' r='214' className='vitruvian-mark-outline' />

      <g filter='url(#softGlow)'>
        <g className='vitruvian-limb-back'>
          <path d='M248 165 C218 174 178 183 132 196 C106 203 82 210 62 220 C55 223 53 232 57 239 C61 246 70 248 78 245 C100 236 124 229 150 223 C194 212 229 210 252 211 Z' />
          <path d='M264 165 C294 174 334 183 380 196 C406 203 430 210 450 220 C457 223 459 232 455 239 C451 246 442 248 434 245 C412 236 388 229 362 223 C318 212 283 210 260 211 Z' />
          <path d='M246 298 C226 327 208 356 190 392 C179 415 170 438 163 461 C161 469 166 476 174 477 C182 479 189 474 192 466 C199 444 208 422 219 401 C235 369 252 341 267 319 Z' />
          <path d='M266 298 C286 327 304 356 322 392 C333 415 342 438 349 461 C351 469 346 476 338 477 C330 479 323 474 320 466 C313 444 304 422 293 401 C277 369 260 341 245 319 Z' />
        </g>

        <g className='vitruvian-limb-front'>
          <path d='M246 177 C210 182 171 186 131 189 C105 191 81 193 58 198 C49 200 45 208 48 216 C51 224 60 228 69 226 C91 221 114 219 139 218 C182 216 217 217 248 221 Z' />
          <path d='M266 177 C302 182 341 186 381 189 C407 191 431 193 454 198 C463 200 467 208 464 216 C461 224 452 228 443 226 C421 221 398 219 373 218 C330 216 295 217 264 221 Z' />
          <path d='M246 302 C232 332 220 361 211 396 C204 420 199 442 197 463 C196 472 202 479 211 479 C219 480 226 475 227 466 C230 444 235 421 241 399 C250 366 262 336 274 308 Z' />
          <path d='M266 302 C280 332 292 361 301 396 C308 420 313 442 315 463 C316 472 310 479 301 479 C293 480 286 475 285 466 C282 444 277 421 271 399 C262 366 250 336 238 308 Z' />
        </g>

        <g className='vitruvian-body-group'>
          <ellipse cx='256' cy='123' rx='33' ry='38' fill='url(#goldMetal)' />
          <path
            d='M218 168
               C222 150 236 139 256 139
               C276 139 290 150 294 168
               C301 194 309 219 313 246
               C317 271 317 293 315 318
               C313 344 307 369 297 394
               C287 419 274 443 268 468
               C266 476 261 480 256 480
               C251 480 246 476 244 468
               C238 443 225 419 215 394
               C205 369 199 344 197 318
               C195 293 195 271 199 246
               C203 219 211 194 218 168 Z'
            fill='url(#goldMetal)'
          />
          <path
            d='M223 183 C235 177 246 175 256 175 C266 175 277 177 289 183'
            stroke='url(#goldSoft)'
            strokeWidth='4'
            strokeLinecap='round'
            opacity='0.65'
          />
          <path
            d='M214 210 C231 223 246 229 256 229 C266 229 281 223 298 210'
            stroke='url(#goldSoft)'
            strokeWidth='4'
            strokeLinecap='round'
            opacity='0.45'
          />
          <path
            d='M223 252 C235 258 246 260 256 260 C266 260 277 258 289 252'
            stroke='url(#goldSoft)'
            strokeWidth='4'
            strokeLinecap='round'
            opacity='0.42'
          />
          <path
            d='M229 281 C239 286 248 288 256 288 C264 288 273 286 283 281'
            stroke='url(#goldSoft)'
            strokeWidth='4'
            strokeLinecap='round'
            opacity='0.38'
          />
        </g>
      </g>
    </svg>
  )
}

export function VitruvianCanvas() {
  return (
    <div className='vitruvian-logo-sculpture' aria-hidden='true'>
      <div className='vitruvian-logo-glow' />
      <div className='vitruvian-logo-depth vitruvian-logo-depth-back'>
        <VitruvianMark />
      </div>
      <div className='vitruvian-logo-depth vitruvian-logo-depth-mid'>
        <VitruvianMark />
      </div>
      <div className='vitruvian-logo-depth vitruvian-logo-depth-front'>
        <VitruvianMark />
      </div>
    </div>
  )
}
